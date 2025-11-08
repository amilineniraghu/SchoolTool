import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';
import { IconMap } from './Icons';

interface MindMapProps {
  data: MindMapNode;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // --- Tooltip Setup ---
    // Create a tooltip div that we'll show and hide on hover
    const tooltip = d3.select('body').append('div')
      .attr('class', 'mindmap-tooltip absolute z-50 invisible px-3 py-2 text-sm font-light text-white bg-slate-900 rounded-md shadow-lg opacity-0 transition-opacity duration-200 pointer-events-none')
      .style('max-width', '250px');

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1000;
    const height = 800;
    const margin = { top: 50, right: 120, bottom: 50, left: 120 };

    const root = d3.hierarchy(data);
    
    // Assign a unique ID to each node for easy selection during interaction
    let nodeId = 0;
    root.each(d => { (d as any).id = nodeId++; });

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

    const links = contentGroup.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('id', d => `link-${(d.source as any).id}-${(d.target as any).id}`)
      .attr('d', linkGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease');

    const nodes = contentGroup
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', (d) => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
      .attr('id', d => `node-${(d as any).id}`)
      .attr('transform', (d) => `translate(${(d as any).y},${(d as any).x})`)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.3s ease');


    const nodeSize = 32;
    const iconSize = 20;

    nodes
      .append('circle')
      .attr('r', nodeSize / 2)
      .attr('fill', d => d.depth === 0 ? '#4f46e5' : '#eef2ff')
      .attr('stroke', d => d.depth === 0 ? '#4338ca' : '#c7d2fe')
      .attr('stroke-width', 1.5);

    nodes.each(function (d) {
      const iconData = IconMap[d.data.icon || 'DocumentText'];
      if (iconData) {
        const scale = iconSize / 24; // Source icons are 24x24
        d3.select(this)
          .append('path')
          .attr('d', iconData.path)
          .attr('fill', d.depth === 0 ? 'white' : '#4338ca')
          .attr('transform', `translate(-${iconSize/2}, -${iconSize/2}) scale(${scale})`);
      }
    });

    nodes
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.children ? -(nodeSize / 2 + 6) : (nodeSize / 2 + 6)))
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

    // Add hover interactions for highlighting and tooltips
    nodes
      .on('mouseover', (event, d_hovered) => {
        const d = d_hovered as any;
        
        // --- Highlighting Logic ---
        nodes.style('opacity', 0.2);
        links.style('opacity', 0.2);
        d3.select(`#node-${d.id}`).style('opacity', 1);

        if (d.parent) {
          d3.select(`#node-${d.parent.id}`).style('opacity', 1);
          d3.select(`#link-${d.parent.id}-${d.id}`)
            .style('opacity', 1)
            .attr('stroke', '#4f46e5')
            .attr('stroke-width', 3);
        }
        if (d.children) {
          d.children.forEach((child: any) => {
            d3.select(`#node-${child.id}`).style('opacity', 1);
            d3.select(`#link-${d.id}-${child.id}`)
              .style('opacity', 1)
              .attr('stroke', '#4f46e5')
              .attr('stroke-width', 3);
          });
        }
        
        // --- Tooltip Logic ---
        let tooltipContent = `<div class="font-semibold text-base mb-1 border-b border-slate-700 pb-1">${d.data.name}</div>`;
        if (d.data.details) {
          tooltipContent += `<div class="mt-1">${d.data.details}</div>`;
        }
        tooltip.html(tooltipContent)
          .style('opacity', 1)
          .style('visibility', 'visible');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY + 15}px`);
      })
      .on('mouseout', () => {
        // --- Highlighting Reset ---
        nodes.style('opacity', 1);
        links
          .style('opacity', 1)
          .attr('stroke', '#cbd5e1')
          .attr('stroke-width', 2);
        
        // --- Tooltip Reset ---
        tooltip.style('opacity', 0).style('visibility', 'hidden');
      });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        zoomableGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Cleanup tooltip on component re-render or unmount
    return () => {
      tooltip.remove();
    };

  }, [data]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
};

export default MindMap;
