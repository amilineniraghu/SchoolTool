import React from 'react';
import { MindMapNode } from '../types';
import * as Icons from './Icons';

// A helper to get the icon component by name
const getIcon = (name: string): React.FC<React.SVGProps<SVGSVGElement>> => {
  const iconName = name as keyof typeof Icons;
  const IconComponent = Icons[iconName];
  return IconComponent || Icons.DocumentText;
};

const Node: React.FC<{ node: MindMapNode; level: number }> = ({ node, level }) => {
  const Icon = getIcon(node.icon);
  const hasChildren = node.children && node.children.length > 0;

  const levelStyles = [
    { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
    { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300' },
    { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
    { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  ];

  const style = levelStyles[level % levelStyles.length];

  return (
    <li className="relative group">
      {/* Connector Line */}
      <span className="absolute top-0 left-0 w-px h-full bg-slate-300 -translate-x-4 translate-y-6" aria-hidden="true"></span>
      
      <div className="flex flex-col gap-2">
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${style.bg} ${style.border} shadow-sm`}>
          <div className="flex-shrink-0">
            <Icon className={`w-6 h-6 ${style.text}`} />
          </div>
          <div>
            <h4 className={`text-md font-semibold ${style.text}`}>{node.name}</h4>
            {node.details && <p className={`mt-1 text-sm ${style.text} opacity-80`}>{node.details}</p>}
          </div>
        </div>
        
        {hasChildren && (
          <ul className="pl-8 space-y-4 pt-4">
            {node.children?.map((child, index) => (
              <Node key={`${level}-${index}-${child.name}`} node={child} level={level + 1} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

interface MindMapProps {
  data: MindMapNode | null;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <ul className="space-y-4">
        {/* The first node doesn't have a connector line from above, so it's rendered outside the recursive component */}
        <li className="relative">
          <div className="flex flex-col gap-2">
            <div className={`flex items-start gap-3 p-4 rounded-lg border bg-slate-100 border-slate-300 shadow`}>
               <div className="flex-shrink-0">
                {React.createElement(getIcon(data.icon), { className: 'w-7 h-7 text-slate-700' })}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{data.name}</h3>
                {data.details && <p className="mt-1 text-sm text-slate-600">{data.details}</p>}
              </div>
            </div>
            
            {data.children && data.children.length > 0 && (
              <ul className="pl-8 space-y-4 pt-4">
                {data.children?.map((child, index) => (
                  <Node key={`0-${index}-${child.name}`} node={child} level={0} />
                ))}
              </ul>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MindMap;
