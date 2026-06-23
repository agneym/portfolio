import { useEffect, useRef } from "react";
import rough from "roughjs";

interface Series {
  label: string;
  value: number;
  color: string;
}

interface RoughBarChartProps {
  title: string;
  unit?: string;
  off: Series;
  on: Series;
}

export function RoughBarChart({
  title,
  unit = "",
  off,
  on,
}: RoughBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear previous contents.
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const width = 640;
    const height = 360;
    const padding = { top: 48, right: 24, bottom: 64, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(off.value, on.value);
    const yScale = chartHeight / (maxValue * 1.1);

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const rc = rough.svg(svg);

    // Title
    const titleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    titleText.setAttribute("x", String(width / 2));
    titleText.setAttribute("y", "28");
    titleText.setAttribute("text-anchor", "middle");
    titleText.setAttribute("font-size", "16");
    titleText.setAttribute("font-weight", "600");
    titleText.setAttribute("fill", "currentColor");
    titleText.textContent = title;
    svg.appendChild(titleText);

    // Axes
    const xAxis = rc.line(
      padding.left,
      height - padding.bottom,
      width - padding.right,
      height - padding.bottom,
      {
        stroke: "currentColor",
        strokeWidth: 1.5,
        roughness: 1.2,
      },
    );
    svg.appendChild(xAxis);

    const yAxis = rc.line(
      padding.left,
      padding.top,
      padding.left,
      height - padding.bottom,
      {
        stroke: "currentColor",
        strokeWidth: 1.5,
        roughness: 1.2,
      },
    );
    svg.appendChild(yAxis);

    // Y-axis ticks and labels
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const value = (maxValue * 1.1 * i) / ticks;
      const y = height - padding.bottom - value * yScale;

      const tick = rc.line(padding.left - 6, y, padding.left, y, {
        stroke: "currentColor",
        strokeWidth: 1,
      });
      svg.appendChild(tick);

      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      label.setAttribute("x", String(padding.left - 12));
      label.setAttribute("y", String(y + 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("font-size", "11");
      label.setAttribute("fill", "currentColor");
      label.textContent = formatCompact(value, unit);
      svg.appendChild(label);
    }

    // Bars
    const barWidth = 80;
    const centers: [number, number] = [
      padding.left + chartWidth / 3,
      padding.left + (chartWidth * 2) / 3,
    ];
    const series = [off, on];

    series.forEach((s, i) => {
      const center = centers[i];
      if (center == null) return;
      const barHeight = s.value * yScale;
      const x = center - barWidth / 2;
      const y = height - padding.bottom - barHeight;

      const bar = rc.rectangle(x, y, barWidth, barHeight, {
        fill: s.color,
        fillStyle: "hachure",
        fillWeight: 1.5,
        roughness: 1.8,
        stroke: s.color,
        strokeWidth: 1.5,
      });
      svg.appendChild(bar);

      // Value label above bar
      const valueLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      valueLabel.setAttribute("x", String(center));
      valueLabel.setAttribute("y", String(y - 10));
      valueLabel.setAttribute("text-anchor", "middle");
      valueLabel.setAttribute("font-size", "12");
      valueLabel.setAttribute("font-weight", "600");
      valueLabel.setAttribute("fill", "currentColor");
      valueLabel.textContent = formatExact(s.value, unit);
      svg.appendChild(valueLabel);

      // X-axis label
      const axisLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      axisLabel.setAttribute("x", String(center));
      axisLabel.setAttribute("y", String(height - padding.bottom + 24));
      axisLabel.setAttribute("text-anchor", "middle");
      axisLabel.setAttribute("font-size", "13");
      axisLabel.setAttribute("font-weight", "500");
      axisLabel.setAttribute("fill", "currentColor");
      axisLabel.textContent = s.label;
      svg.appendChild(axisLabel);
    });
  }, [off, on, title, unit]);

  return (
    <figure className="my-8 flex flex-col items-center">
      <svg
        ref={svgRef}
        aria-label={`${title}: ${off.label} ${formatExact(off.value, unit)} vs ${on.label} ${formatExact(on.value, unit)}`}
        className="h-auto w-full max-w-2xl text-slate-800 dark:text-slate-200"
      />
    </figure>
  );
}

function formatCompact(value: number, unit: string): string {
  const suffixes = ["", "K", "M", "B"];
  const tier = value === 0 ? 0 : Math.floor(Math.log10(value) / 3);
  const scaled = value / 10 ** (tier * 3);
  const formatted =
    tier > 0 ? `${scaled.toFixed(tier === 1 ? 0 : 1)}` : `${Math.round(value)}`;
  return `${formatted}${suffixes[tier]}${unit}`;
}

function formatExact(value: number, unit: string): string {
  return `${value.toLocaleString()}${unit}`;
}
