import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface MapsProps {
  geoData: any;
  onCountryClick: (countryId: string) => void;
  highlightCountry?: string | null;
  correctCountry?: string | null;
}

const Maps: React.FC<MapsProps> = ({ geoData, onCountryClick, highlightCountry, correctCountry }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!geoData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = containerRef.current.getBoundingClientRect();

    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g');

    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const pathGenerator = d3.geoPath().projection(projection);

    const countryPaths = g.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', pathGenerator as any)
      .attr('fill', '#e2e8f0')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        onCountryClick(d.id);
      })
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#94a3b8');
      })
      .on('mouseout', function (event, d: any) {
         // Revert color based on highlight/correct status
         const isHighlighted = highlightCountry === d.id;
         const isCorrect = correctCountry === d.id;
         let color = '#e2e8f0'; // default
         if (isCorrect) color = '#4ade80'; // green for correct
         else if (isHighlighted) color = '#f87171'; // red for incorrect
         d3.select(this).attr('fill', color);
      });

      // Apply initial highlight/correct colors
      countryPaths.attr('fill', (d: any) => {
        if (correctCountry === d.id) return '#4ade80'; // green for correct
        if (highlightCountry === d.id) return '#f87171'; // red for incorrect
        return '#e2e8f0';
      });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [geoData, onCountryClick, highlightCountry, correctCountry]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden bg-slate-100 border border-slate-300">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Maps;
