
import React, { useState, useCallback } from 'react';
import { MindMapNode, LoadingState } from '../types';
import { extractParagraphsFromImage, generateMindMap } from '../services/geminiService';
import { UploadIcon, SparklesIcon, XCircleIcon, ArrowsPointingOutIcon } from '../components/Icons';
import MindMapModal from '../components/MindMapModal';
import ImagePreviewModal from '../components/ImagePreviewModal';

const MindMapGeneratorPage: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null);
    const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);
    
    const [isMindMapModalOpen, setMindMapModalOpen] = useState(false);
    const [isImagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);

    const resetState = () => {
        setImageFile(null);
        setImagePreview(null);
        setParagraphs([]);
        setSelectedParagraphIndex(null);
        setMindMapData(null);
        setLoadingState('idle');
        setError(null);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            resetState();
            const file = event.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExtractText = useCallback(async () => {
        if (!imageFile) {
            setError("Please select an image first.");
            return;
        }
        setLoadingState('extracting');
        setError(null);
        setParagraphs([]);
        setSelectedParagraphIndex(null);

        try {
            const extracted = await extractParagraphsFromImage(imageFile);
            if (extracted.length === 0) {
                setError("No paragraphs could be found in the image. Please try a different image.");
                setLoadingState('error');
                return;
            }
            setParagraphs(extracted);
            setSelectedParagraphIndex(0); // Select the first paragraph by default
            setLoadingState('idle');
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during text extraction.');
            setLoadingState('error');
        }
    }, [imageFile]);

    const handleGenerateMindMap = useCallback(async () => {
        if (selectedParagraphIndex === null || !paragraphs[selectedParagraphIndex]) {
            setError("Please select a paragraph to generate the mind map from.");
            return;
        }
        setLoadingState('generating');
        setError(null);
        setMindMapData(null);

        try {
            const data = await generateMindMap(paragraphs[selectedParagraphIndex]);
            setMindMapData(data);
            setMindMapModalOpen(true);
            setLoadingState('idle');
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred while generating the mind map.');
            setLoadingState('error');
        }
    }, [paragraphs, selectedParagraphIndex]);


    const renderLoadingIndicator = (state: LoadingState, text: string) => {
        if (loadingState !== state) return null;
        return (
            <div className="flex items-center space-x-2 text-sm text-slate-500">
                <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{text}</span>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Mind Map Generator</h1>
            <p className="text-slate-600 mb-8">Upload an image of your study notes, and we'll transform the text into an interactive mind map to help you visualize and connect key concepts.</p>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Step 1: Upload Image */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 bg-indigo-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">1</div>
                        <h2 className="ml-3 text-xl font-semibold text-slate-800">Upload Your Notes</h2>
                    </div>

                    <div className="mt-4 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                        <label htmlFor="file-upload" className="mt-4 relative cursor-pointer bg-indigo-600 text-white font-medium rounded-md py-2 px-4 hover:bg-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>{imageFile ? "Change Image" : "Select an Image"}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="mt-2 text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    </div>

                    {imagePreview && (
                         <div className="mt-6">
                            <h3 className="text-lg font-medium text-slate-700">Image Preview:</h3>
                            <div className="relative mt-2 rounded-lg border border-slate-300 p-2 group">
                                <img src={imagePreview} alt="Notes preview" className="w-full h-auto max-h-60 object-contain rounded" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                    <button onClick={() => setImagePreviewModalOpen(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full shadow-lg">
                                        <ArrowsPointingOutIcon className="w-6 h-6 text-slate-700" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleExtractText}
                        disabled={!imageFile || loadingState === 'extracting'}
                        className="w-full mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                         {loadingState === 'extracting' ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Extracting Text...
                            </>
                        ) : 'Extract Text from Image'}
                    </button>
                </div>

                {/* Step 2 & 3: Select Paragraph & Generate */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 bg-indigo-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">2</div>
                        <h2 className="ml-3 text-xl font-semibold text-slate-800">Select a Paragraph</h2>
                    </div>

                    <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50 min-h-[200px] max-h-[300px] overflow-y-auto">
                        {loadingState === 'extracting' && renderLoadingIndicator('extracting', 'Extracting paragraphs from image...')}
                        
                        {loadingState === 'error' && !paragraphs.length && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                <XCircleIcon className="w-10 h-10 text-red-400 mb-2"/>
                                <p className="text-center">Could not extract text. <br /> {error}</p>
                            </div>
                        )}

                        {paragraphs.length > 0 && (
                            <fieldset>
                                <legend className="sr-only">Choose a paragraph</legend>
                                <div className="space-y-4">
                                    {paragraphs.map((p, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`paragraph-${index}`}
                                                    name="paragraph"
                                                    type="radio"
                                                    checked={selectedParagraphIndex === index}
                                                    onChange={() => setSelectedParagraphIndex(index)}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor={`paragraph-${index}`} className="font-medium text-gray-700 cursor-pointer">{p}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        )}

                        {paragraphs.length === 0 && loadingState === 'idle' && (
                             <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                <p>Extracted paragraphs will appear here.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center mt-6 mb-4">
                        <div className="flex-shrink-0 bg-indigo-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">3</div>
                        <h2 className="ml-3 text-xl font-semibold text-slate-800">Generate Mind Map</h2>
                    </div>

                    <button
                        onClick={handleGenerateMindMap}
                        disabled={selectedParagraphIndex === null || loadingState === 'generating'}
                        className="w-full mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
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
                                <SparklesIcon className="w-5 h-5 mr-2"/>
                                Generate Mind Map
                            </>
                        )}
                    </button>
                </div>
            </div>

            <MindMapModal 
                isOpen={isMindMapModalOpen}
                onClose={() => setMindMapModalOpen(false)}
                mindMapData={mindMapData}
            />

            <ImagePreviewModal
                isOpen={isImagePreviewModalOpen}
                onClose={() => setImagePreviewModalOpen(false)}
                imageUrl={imagePreview}
            />

        </div>
    );
};

export default MindMapGeneratorPage;
