import { useEffect, useRef } from "react";
import rough from "roughjs";

interface Series {
  label: string;
  color: string;
}

interface Group {
  label: string;
  values: number[];
}

interface GroupedBarChartProps {
  title: string;
  unit?: string;
  series: Series[];
  groups: Group[];
  footnote?: string;
}

export function GroupedBarChart({
  title,
  unit = "%",
  series,
  groups,
  footnote,
}: GroupedBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear previous contents.
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const width = 780;
    const topPadding = 56;
    const legendHeight = footnote ? 76 : 44;
    const xAxisLabelHeight = 26;
    const bottomPadding = xAxisLabelHeight + 20 + legendHeight;
    const maxValue = Math.max(...groups.flatMap((g) => g.values));
    const yMax = maxValue * 1.1;
    const height = 400;

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

    const chartTop = topPadding;
    const chartBottom = height - bottomPadding;
    const chartLeft = 64;
    const chartRight = width - 24;
    const chartWidth = chartRight - chartLeft;
    const chartHeight = chartBottom - chartTop;
    const yScale = chartHeight / yMax;

    // Y-axis ticks and labels
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const value = (yMax * i) / ticks;
      const y = chartBottom - value * yScale;

      const tick = rc.line(chartLeft - 6, y, chartLeft, y, {
        stroke: "currentColor",
        strokeWidth: 1,
      });
      svg.appendChild(tick);

      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      label.setAttribute("x", String(chartLeft - 12));
      label.setAttribute("y", String(y + 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("font-size", "11");
      label.setAttribute("fill", "currentColor");
      label.textContent = `${Math.round(value)}${unit}`;
      svg.appendChild(label);
    }

    // X-axis
    const xAxis = rc.line(chartLeft, chartBottom, chartRight, chartBottom, {
      stroke: "currentColor",
      strokeWidth: 1.5,
      roughness: 1.2,
    });
    svg.appendChild(xAxis);

    // Grouped bars
    const groupSlot = chartWidth / groups.length;
    const barGap = 6;
    const barWidth = Math.min(
      64,
      (groupSlot * 0.7 - barGap * (series.length - 1)) / series.length,
    );

    groups.forEach((group, gi) => {
      const groupStart = chartLeft + gi * groupSlot;
      const groupWidth =
        barWidth * series.length + barGap * (series.length - 1);
      const groupOffset = (groupSlot - groupWidth) / 2;

      series.forEach((s, si) => {
        const value = group.values[si];
        if (value == null) return;
        const barHeight = value * yScale;
        const x = groupStart + groupOffset + si * (barWidth + barGap);
        const y = chartBottom - barHeight;

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
        valueLabel.setAttribute("x", String(x + barWidth / 2));
        valueLabel.setAttribute("y", String(y - 8));
        valueLabel.setAttribute("text-anchor", "middle");
        valueLabel.setAttribute("font-size", "12");
        valueLabel.setAttribute("font-weight", "600");
        valueLabel.setAttribute("fill", "currentColor");
        valueLabel.textContent = `${value}${unit}`;
        svg.appendChild(valueLabel);
      });

      // Group label on the x-axis
      const axisLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      axisLabel.setAttribute("x", String(groupStart + groupSlot / 2));
      axisLabel.setAttribute("y", String(chartBottom + 20));
      axisLabel.setAttribute("text-anchor", "middle");
      axisLabel.setAttribute("font-size", "13");
      axisLabel.setAttribute("font-weight", "500");
      axisLabel.setAttribute("fill", "currentColor");
      axisLabel.textContent = group.label;
      svg.appendChild(axisLabel);
    });

    // Legend
    const legendY = chartBottom + xAxisLabelHeight + 14;
    const legendSpacing = 170;
    const totalLegendWidth = series.length * legendSpacing;
    const legendStartX = (width - totalLegendWidth) / 2;

    series.forEach((s, i) => {
      const lx = legendStartX + i * legendSpacing;

      const swatch = rc.rectangle(lx, legendY, 14, 14, {
        fill: s.color,
        fillStyle: "hachure",
        fillWeight: 1.5,
        roughness: 1.5,
        stroke: s.color,
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
      legendLabel.textContent = s.label;
      svg.appendChild(legendLabel);
    });

    // Footnote
    if (footnote) {
      const fn = document.createElementNS("http://www.w3.org/2000/svg", "text");
      fn.setAttribute("x", String(width / 2));
      fn.setAttribute("y", String(height - 14));
      fn.setAttribute("text-anchor", "middle");
      fn.setAttribute("font-size", "11");
      fn.setAttribute("fill", "currentColor");
      fn.textContent = footnote;
      svg.appendChild(fn);
    }
  }, [title, unit, series, groups, footnote]);

  return (
    <figure className="my-8 flex flex-col items-center">
      <svg
        ref={svgRef}
        aria-label={`${title}: ${groups
          .map(
            (g) =>
              `${g.label} ${g.values.map((v) => `${v}${unit}`).join(", ")}`,
          )
          .join("; ")}`}
        className="h-auto w-full max-w-3xl text-slate-800 dark:text-slate-200"
      />
    </figure>
  );
}
