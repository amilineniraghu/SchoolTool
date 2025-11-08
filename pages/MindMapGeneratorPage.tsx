import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractParagraphsFromImage, generateMindMap } from '../services/geminiService';
import { MindMapNode, LoadingState } from '../types';
import MindMapModal from '../components/MindMapModal';
import { UploadIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, BrainIcon } from '../components/Icons';

const MindMapGeneratorPage: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [selectedParagraphs, setSelectedParagraphs] = useState<number[]>([]);
    const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const resetState = () => {
        setImageFile(null);
        setImagePreview(null);
        setParagraphs([]);
        setSelectedParagraphs([]);
        setMindMapData(null);
        setLoadingState('idle');
        setError(null);
        setIsModalOpen(false);
    };
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            resetState();
            const file = acceptedFiles[0];
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            handleExtractParagraphs(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        multiple: false,
    });

    const handleExtractParagraphs = async (file: File) => {
        setLoadingState('extracting');
        setError(null);
        try {
            const extracted = await extractParagraphsFromImage(file);
            setParagraphs(extracted);
            setSelectedParagraphs(extracted.map((_, index) => index)); // Select all by default
            setLoadingState('idle');
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during text extraction.');
            setLoadingState('error');
        }
    };
    
    const handleToggleParagraph = (index: number) => {
        setSelectedParagraphs(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleGenerateMindMap = async () => {
        const selectedText = selectedParagraphs
            .sort((a, b) => a - b)
            .map(i => paragraphs[i])
            .join('\n\n');

        if (!selectedText.trim()) {
            setError("Please select at least one paragraph to generate a mind map.");
            return;
        }

        setLoadingState('generating');
        setError(null);
        setMindMapData(null);

        try {
            const data = await generateMindMap(selectedText);
            setMindMapData(data);
            setIsModalOpen(true);
            setLoadingState('idle');
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred while generating the mind map.');
            setLoadingState('error');
        }
    };

    const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-lg">
            <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold text-slate-700">{message}</p>
        </div>
    );

    const hasSelection = useMemo(() => selectedParagraphs.length > 0, [selectedParagraphs]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <BrainIcon className="w-8 h-8 text-indigo-500"/>
                Mind Map Generator
            </h1>

            {/* Step 1: Upload */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Step 1: Upload an Image of Your Notes</h2>
                 <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'}`}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center text-slate-500">
                        <UploadIcon className="w-12 h-12 mb-3" />
                        {isDragActive ?
                            <p className="text-lg font-semibold text-indigo-600">Drop the image here ...</p> :
                            <p className="text-lg">Drag 'n' drop an image here, or click to select</p>
                        }
                        <p className="text-sm mt-1">PNG, JPG, WEBP accepted</p>
                    </div>
                </div>

                 {imagePreview && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-slate-600 mb-2">Image Preview:</h3>
                        <div className="relative border rounded-lg overflow-hidden max-w-md mx-auto">
                            <img src={imagePreview} alt="Uploaded notes" className="w-full h-auto" />
                            <button onClick={resetState} className="absolute top-2 right-2 p-1 bg-white/70 rounded-full text-slate-600 hover:bg-white hover:text-slate-800">
                                <XCircleIcon className="w-6 h-6"/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {loadingState === 'extracting' && <LoadingIndicator message="Analyzing image and extracting text..." />}
            
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3">
                    <XCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5"/>
                    <div>
                        <h3 className="font-bold">An Error Occurred</h3>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Step 2: Select Paragraphs */}
            {paragraphs.length > 0 && loadingState !== 'extracting' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Step 2: Select Paragraphs to Include</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {paragraphs.map((p, index) => (
                            <div key={index} onClick={() => handleToggleParagraph(index)} className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-start gap-4 ${selectedParagraphs.includes(index) ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                <div className="flex-shrink-0 mt-1">
                                    {selectedParagraphs.includes(index) ? 
                                     <CheckCircleIcon className="w-6 h-6 text-indigo-500"/> :
                                     <div className="w-6 h-6 border-2 border-slate-300 rounded-full bg-white"></div>
                                    }
                                </div>
                                <p className={`text-sm ${selectedParagraphs.includes(index) ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {p}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Step 3: Generate Mind Map */}
            {paragraphs.length > 0 && loadingState !== 'extracting' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Step 3: Generate Your Mind Map</h2>
                    <p className="text-sm text-slate-600 mb-5">Click the button below to generate a mind map from the {selectedParagraphs.length} selected paragraph(s).</p>
                    <button
                        onClick={handleGenerateMindMap}
                        disabled={loadingState === 'generating' || !hasSelection}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        {loadingState === 'generating' ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                           <>
                            <SparklesIcon className="w-6 h-6" />
                            Generate Mind Map
                           </>
                        )}
                    </button>
                    {!hasSelection && <p className="text-center text-sm text-red-600 mt-3">Please select at least one paragraph.</p>}
                </div>
            )}

            <MindMapModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mindMapData={mindMapData}
            />
        </div>
    );
};

export default MindMapGeneratorPage;
