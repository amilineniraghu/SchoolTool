import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';
import { IconMap } from './Icons';

interface MindMapProps {
  data: MindMapNode;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);

    const tooltip = d3.select('body').append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('z-index', '100')
        .style('visibility', 'hidden')
        .style('background', 'rgba(0,0,0,0.8)')
        .style('color', '#fff')
        .style('padding', '8px 12px')
        .style('border-radius', '6px')
        .style('font-family', "'Inter', sans-serif")
        .style('font-size', '12px')
        .style('max-width', '250px');
    
    function draw(width: number, height: number) {
      if(width <= 0 || height <= 0) return;
      
      // Clear previous render to prevent duplication on resize
      svg.selectAll('*').remove();
        
      svg.attr('width', width).attr('height', height);
      const g = svg.append('g');

      const nodeWidth = 160;
      const nodeHeight = 60;
      const horizontalSeparation = 100;
      const verticalSeparation = 80;

      const tree = d3.tree<MindMapNode>()
        .nodeSize([nodeHeight + verticalSeparation, nodeWidth + horizontalSeparation]);
      
      const root = d3.hierarchy(data);
      const treeLayout = tree(root);

      const linkGenerator = d3.linkHorizontal<d3.HierarchyPointLink<MindMapNode>, d3.HierarchyPointNode<MindMapNode>>()
        .x(d => d.y)
        .y(d => d.x);

      // --- LINKS ---
      const links = g.append('g')
        .attr('class', 'links')
        .attr('fill', 'none')
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2)
        .selectAll('path')
        .data(treeLayout.links())
        .join('path')
        .attr('d', linkGenerator as any);

      // --- NODES ---
      const nodes = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(treeLayout.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.y},${d.x})`);

      const nodeColors = d3.scaleSequential(d3.interpolateCool).domain([0, root.height + 1]);

      nodes.append('rect')
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('x', -nodeWidth / 2)
        .attr('y', -nodeHeight / 2)
        .attr('rx', 8)
        .attr('ry', 8)
        .attr('fill', d => d3.color(nodeColors(d.depth))?.brighter(1.5).toString() || 'white')
        .attr('stroke', d => nodeColors(d.depth))
        .attr('stroke-width', 2);
        
      // --- ICONS ---
      nodes.each(function (d) {
        const iconData = IconMap[d.data.icon];
        if (iconData) {
            d3.select(this).append('path')
                .attr('d', iconData.path)
                .attr('transform', `translate(${-nodeWidth / 2 + 10}, ${-12}) scale(0.5)`)
                .attr(iconData.type === 'fill' ? 'fill' : 'stroke', nodeColors(d.depth))
                .attr('stroke-width', iconData.type === 'stroke' ? 3 : 0)
                .attr('fill', iconData.type === 'fill' ? nodeColors(d.depth) : 'none');
        }
      });

      // --- TEXT ---
      nodes.append('foreignObject')
        .attr('width', nodeWidth - 40)
        .attr('height', nodeHeight)
        .attr('x', -nodeWidth / 2 + 35)
        .attr('y', -nodeHeight / 2)
        .append('xhtml:div')
        .style('width', `${nodeWidth - 40}px`)
        .style('height', `${nodeHeight}px`)
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('font-family', "'Inter', sans-serif")
        .style('font-size', '13px')
        .style('font-weight', '600')
        .style('color', '#1e293b')
        .style('line-height', '1.3')
        .html(d => d.data.name);

      // --- CENTER & ZOOM ---
      const bounds = g.node()!.getBBox();
      const scale = 0.85 * Math.min(width / bounds.width, height / bounds.height);
      const translateX = (width - bounds.width * scale) / 2 - (bounds.x - 30) * scale;
      const translateY = (height - bounds.height * scale) / 2 - bounds.y * scale;

      const initialTransform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 2])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom).call(zoom.transform, initialTransform);

      // --- INTERACTIVITY ---
      nodes
        .on('mouseover', function(event, d) {
          const ancestors = d.ancestors();
          const ancestorIds = new Set(ancestors.map(node => node.data.name));
          
          nodes.transition().duration(300).attr('opacity', n => ancestorIds.has(n.data.name) ? 1.0 : 0.3);
          links.transition().duration(300)
            .attr('opacity', l => ancestorIds.has(l.source.data.name) && ancestorIds.has(l.target.data.name) ? 1.0 : 0.2)
            .attr('stroke', l => ancestorIds.has(l.source.data.name) && ancestorIds.has(l.target.data.name) ? nodeColors(l.source.depth) : '#cbd5e1')
            .attr('stroke-width', l => ancestorIds.has(l.source.data.name) && ancestorIds.has(l.target.data.name) ? 3 : 2);
          
          tooltip
              .html(`<strong>${d.data.name}</strong><br/>${d.data.details || ''}`)
              .style('visibility', 'visible');
        })
        .on('mousemove', function(event) {
            tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', function() {
          nodes.transition().duration(300).attr('opacity', 1);
          links.transition().duration(300).attr('opacity', 1).attr('stroke', '#cbd5e1').attr('stroke-width', 2);
          tooltip.style('visibility', 'hidden');
        });
    }

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      draw(width, height);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
        observer.disconnect();
        tooltip.remove();
    };
  }, [data]);

  return (
    <div ref={containerRef} className="w-full h-[65vh] rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default MindMap;