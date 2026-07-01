import { useEffect, useRef } from "react";
import rough from "roughjs";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  segments: [Segment, Segment];
  caption?: string;
}

export function DonutChart({ title, segments, caption }: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const size = 360;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = 110;
    const innerR = 65;

    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    const rc = rough.svg(svg);

    const total = segments[0].value + segments[1].value;
    let startAngle = -Math.PI / 2; // 12 o'clock

    segments.forEach((seg) => {
      const sweep = (seg.value / total) * Math.PI * 2;
      const endAngle = startAngle + sweep;

      // Midpoint for label
      const midAngle = startAngle + sweep / 2;
      const labelR = (outerR + innerR) / 2;
      const labelX = cx + labelR * Math.cos(midAngle);
      const labelY = cy + labelR * Math.sin(midAngle);

      // Draw arc segment using path
      const x1 = cx + outerR * Math.cos(startAngle);
      const y1 = cy + outerR * Math.sin(startAngle);
      const x2 = cx + outerR * Math.cos(endAngle);
      const y2 = cy + outerR * Math.sin(endAngle);
      const x3 = cx + innerR * Math.cos(endAngle);
      const y3 = cy + innerR * Math.sin(endAngle);
      const x4 = cx + innerR * Math.cos(startAngle);
      const y4 = cy + innerR * Math.sin(startAngle);

      const largeArc = sweep > Math.PI ? 1 : 0;

      const d = [
        `M ${x1} ${y1}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
        "Z",
      ].join(" ");

      const segment = rc.path(d, {
        fill: seg.color,
        fillStyle: "hachure",
        fillWeight: 1.5,
        roughness: 1.5,
        stroke: seg.color,
        strokeWidth: 1,
      });
      svg.appendChild(segment);

      // Percentage label inside segment
      const pct = Math.round((seg.value / total) * 100);
      if (pct >= 10) {
        const label = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        label.setAttribute("x", String(labelX));
        label.setAttribute("y", String(labelY + 1));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("font-size", "14");
        label.setAttribute("font-weight", "700");
        label.setAttribute("fill", "#fff");
        label.textContent = `${pct}%`;
        svg.appendChild(label);
      }

      startAngle = endAngle;
    });

    // Center total
    const centerText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    centerText.setAttribute("x", String(cx));
    centerText.setAttribute("y", String(cy));
    centerText.setAttribute("text-anchor", "middle");
    centerText.setAttribute("dominant-baseline", "middle");
    centerText.setAttribute("font-size", "28");
    centerText.setAttribute("font-weight", "700");
    centerText.setAttribute("fill", "currentColor");
    centerText.textContent = `${Math.round(segments[0].value)}%`;
    svg.appendChild(centerText);
  }, [segments]);

  return (
    <figure className="mt-10 mb-5 flex flex-col items-center gap-4">
      {title && (
        <figcaption className="text-base font-semibold text-slate-700 dark:text-slate-200">
          {title}
        </figcaption>
      )}
      <svg
        ref={svgRef}
        aria-label={`${title}: ${segments[0].label} ${segments[0].value}%, ${segments[1].label} ${segments[1].value}%`}
        className="h-auto w-full max-w-xs text-slate-800 dark:text-slate-200"
      />
      <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: seg.color }}
            />
            {seg.label}
          </div>
        ))}
      </div>
      {caption && (
        <p className="max-w-md text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      )}
    </figure>
  );
}
