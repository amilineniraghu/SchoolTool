import React, { useRef, useEffect } from 'react';
import MindMap from './MindMap';
import { MindMapNode } from '../types';
import { XCircleIcon } from './Icons';

interface MindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  mindMapData: MindMapNode | null;
}

const MindMapModal: React.FC<MindMapModalProps> = ({ isOpen, onClose, mindMapData }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] p-6 mx-4 bg-slate-50 rounded-lg shadow-xl transform transition-all overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <h2 id="modal-title" className="text-2xl font-bold text-slate-800">
                Generated Mind Map
            </h2>
            <button
                type="button"
                className="text-slate-400 hover:text-slate-600"
                onClick={onClose}
            >
                <span className="sr-only">Close modal</span>
                <XCircleIcon className="w-8 h-8" />
            </button>
        </div>

        <div className="mt-4">
          {mindMapData ? (
            <MindMap data={mindMapData} />
          ) : (
            <p className="text-center text-slate-500">No mind map data to display.</p>
          )}
        </div>
        
        <div className="flex justify-end pt-6 mt-6 border-t border-slate-200">
            <button
              type="button"
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              Close
            </button>
        </div>

      </div>
    </div>
  );
};

export default MindMapModal;
