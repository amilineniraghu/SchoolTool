
import React, { useRef, useEffect } from 'react';
import { XCircleIcon } from './Icons';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, imageUrl }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] p-4 mx-4 bg-white rounded-lg shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-2 border-b border-slate-200">
            <h2 id="modal-title" className="text-xl font-bold text-slate-800">
                Image Preview
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

        <div className="mt-4 flex justify-center items-center max-h-[75vh]">
          {imageUrl ? (
            <img src={imageUrl} alt="Full size preview" className="max-w-full max-h-full object-contain" />
          ) : (
            <p className="text-center text-slate-500">No image to display.</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ImagePreviewModal;
