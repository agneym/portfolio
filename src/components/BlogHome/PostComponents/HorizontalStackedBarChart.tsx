import { useEffect, useRef } from "react";
import rough from "roughjs";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Row {
  label: string;
  segments: Segment[];
  hideValues?: boolean;
}

interface HorizontalStackedBarChartProps {
  title: string;
  rows: Row[];
  unit?: string;
  footnote?: string;
}

export function HorizontalStackedBarChart({
  title,
  rows,
  unit = "%",
  footnote,
}: HorizontalStackedBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const leftLabelWidth = 80;
    const rightPadding = 60;
    const width = 780;
    const rowHeight = 64;
    const rowGap = 24;
    const topPadding = 56;
    const legendHeight = footnote ? 96 : 48;
    const bottomPadding = 32 + legendHeight;
    const chartWidth = width - leftLabelWidth - rightPadding;
    const height =
      topPadding +
      rows.length * rowHeight +
      (rows.length - 1) * rowGap +
      bottomPadding;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const rc = rough.svg(svg);

    // Title
    const titleEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    titleEl.setAttribute("x", String(width / 2));
    titleEl.setAttribute("y", "28");
    titleEl.setAttribute("text-anchor", "middle");
    titleEl.setAttribute("font-size", "16");
    titleEl.setAttribute("font-weight", "600");
    titleEl.setAttribute("fill", "currentColor");
    titleEl.textContent = title;
    svg.appendChild(titleEl);

    // Draw each row
    rows.forEach((row, i) => {
      const y = topPadding + i * (rowHeight + rowGap);

      // Row label (left side)
      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      label.setAttribute("x", String(leftLabelWidth - 12));
      label.setAttribute("y", String(y + rowHeight / 2 + 1));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("dominant-baseline", "middle");
      label.setAttribute("font-size", "14");
      label.setAttribute("font-weight", "500");
      label.setAttribute("fill", "currentColor");
      label.textContent = row.label;
      svg.appendChild(label);

      // Draw stacked segments
      let xOffset = leftLabelWidth;
      row.segments.forEach((seg) => {
        const segWidth = (seg.value / 100) * chartWidth;
        if (segWidth < 1) return;

        const isLight = isLightColor(seg.color);
        const segRect = rc.rectangle(xOffset, y, segWidth, rowHeight, {
          fill: seg.color,
          fillStyle: isLight ? "solid" : "hachure",
          fillWeight: isLight ? 0 : 1,
          roughness: 1.8,
          stroke: seg.color,
          strokeWidth: 1.5,
        });
        svg.appendChild(segRect);

        // Segment label (inside bar if wide enough)
        if (segWidth > 48 && !row.hideValues) {
          const segLabel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text",
          );
          segLabel.setAttribute("x", String(xOffset + segWidth / 2));
          segLabel.setAttribute("y", String(y + rowHeight / 2 + 1));
          segLabel.setAttribute("text-anchor", "middle");
          segLabel.setAttribute("dominant-baseline", "middle");
          segLabel.setAttribute("font-size", "15");
          segLabel.setAttribute("font-weight", "800");
          // Dark text with white outline — readable on any bar color, any page theme
          segLabel.setAttribute("fill", "#0f172a");
          segLabel.setAttribute("paint-order", "stroke");
          segLabel.setAttribute("stroke", "#fff");
          segLabel.setAttribute("stroke-width", "2.5");
          segLabel.setAttribute("stroke-linejoin", "round");
          segLabel.textContent = `${seg.value}${unit}`;
          svg.appendChild(segLabel);
        }

        // Percentage label above bar for narrow segments
        if (segWidth <= 48 && segWidth > 0) {
          const pctLabel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text",
          );
          pctLabel.setAttribute("x", String(xOffset + segWidth / 2));
          pctLabel.setAttribute("y", String(y - 6));
          pctLabel.setAttribute("text-anchor", "middle");
          pctLabel.setAttribute("font-size", "11");
          pctLabel.setAttribute("fill", "currentColor");
          pctLabel.textContent = `${seg.value}${unit}`;
          svg.appendChild(pctLabel);
        }

        xOffset += segWidth;
      });
    });

    // Collect unique segment labels for legend (preserving order)
    const seen = new Set<string>();
    const legendItems: { label: string; color: string }[] = [];
    for (const row of rows) {
      for (const seg of row.segments) {
        if (!seen.has(seg.label)) {
          seen.add(seg.label);
          legendItems.push({ label: seg.label, color: seg.color });
        }
      }
    }

    // Legend
    const legendY = height - legendHeight + 16;
    const legendSpacing = 180;
    const totalLegendWidth = legendItems.length * legendSpacing;
    const legendStartX = (width - totalLegendWidth) / 2;

    legendItems.forEach((item, i) => {
      const lx = legendStartX + i * legendSpacing;

      const isLightSwatch = isLightColor(item.color);
      const swatch = rc.rectangle(lx, legendY, 14, 14, {
        fill: item.color,
        fillStyle: isLightSwatch ? "solid" : "hachure",
        fillWeight: isLightSwatch ? 0 : 1.5,
        roughness: 1.5,
        stroke: item.color,
        strokeWidth: 1,
      });
      svg.appendChild(swatch);

      const legendLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      legendLabel.setAttribute("x", String(lx + 22));
      legendLabel.setAttribute("y", String(legendY + 12));
      legendLabel.setAttribute("font-size", "12");
      legendLabel.setAttribute("fill", "currentColor");
      legendLabel.textContent = item.label;
      svg.appendChild(legendLabel);
    });

    // Footnote
    if (footnote) {
      const fn = document.createElementNS("http://www.w3.org/2000/svg", "text");
      fn.setAttribute("x", String(width / 2));
      fn.setAttribute("y", String(height - 20));
      fn.setAttribute("text-anchor", "middle");
      fn.setAttribute("font-size", "11");
      fn.setAttribute("fill", "currentColor");

      // Split footnote into lines at natural break points
      const mid = Math.floor(footnote.length / 2);
      let splitAt = footnote.lastIndexOf(",", mid);
      if (splitAt < 0 || splitAt < footnote.length / 3) {
        splitAt = footnote.indexOf(",", mid);
      }
      if (splitAt < 0) splitAt = mid;

      const line1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan",
      );
      line1.setAttribute("x", String(width / 2));
      line1.setAttribute("dy", "0");
      line1.textContent = footnote.slice(0, splitAt + 1).trimEnd();
      fn.appendChild(line1);

      const line2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan",
      );
      line2.setAttribute("x", String(width / 2));
      line2.setAttribute("dy", "14");
      line2.textContent = footnote.slice(splitAt + 1).trimStart();
      fn.appendChild(line2);

      svg.appendChild(fn);
    }
  }, [title, rows, unit, footnote]);

  return (
    <figure className="my-8 flex flex-col items-center">
      <svg
        ref={svgRef}
        className="h-auto w-full max-w-3xl text-slate-800 dark:text-slate-200"
      />
    </figure>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Perceived brightness (YIQ formula)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.75;
}
