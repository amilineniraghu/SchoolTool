import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';

interface MindMapProps {
  data: MindMapNode;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1000;
    const height = 800;
    const margin = { top: 50, right: 120, bottom: 50, left: 120 };

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<MindMapNode>().size([
      height - margin.top - margin.bottom,
      width - margin.left - margin.right,
    ]);

    treeLayout(root);

    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .style('cursor', 'move');

    const zoomableGroup = svg.append('g');

    const contentGroup = zoomableGroup.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const linkGenerator = d3
      .linkHorizontal<d3.HierarchyPointLink<MindMapNode>, d3.HierarchyPointNode<MindMapNode>>()
      .x((d) => d.y)
      .y((d) => d.x);

    contentGroup.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2);

    const nodes = contentGroup
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', (d) => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
      .attr('transform', (d) => `translate(${(d as any).y},${(d as any).x})`);

    nodes
      .append('circle')
      .attr('r', 8)
      .attr('fill', d => d.depth === 0 ? '#4f46e5' : '#6366f1')
      .attr('stroke', '#e0e7ff')
      .attr('stroke-width', 2);

    nodes
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.children ? -12 : 12))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text((d) => d.data.name)
      .style('font-size', '14px')
      .style('font-weight', '500')
      .style('fill', '#334155')
      .clone(true)
      .lower()
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .attr('stroke', 'white');

    // Zoom functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5]) // Set min/max zoom levels
      .on('zoom', (event) => {
        zoomableGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [data]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
};

export default MindMap;
