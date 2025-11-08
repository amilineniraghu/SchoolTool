import React, { useState, useCallback, useMemo } from 'react';
import { extractParagraphsFromImage, generateMindMap } from './services/geminiService';
import { MindMapNode, LoadingState } from './types';
import MindMap from './components/MindMap';
import { UploadIcon, BrainIcon } from './components/Icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedParagraphs, setExtractedParagraphs] = useState<string[] | null>(null);
  const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset state for new upload
      setMindMapData(null);
      setExtractedParagraphs(null);
      setSelectedParagraph(null);
      setError(null);
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = useCallback(async () => {
    if (!imageFile) return;

    setLoadingState('extracting');
    setError(null);
    setMindMapData(null);
    setExtractedParagraphs(null);
    setSelectedParagraph(null);
    try {
      const paragraphs = await extractParagraphsFromImage(imageFile);
      setExtractedParagraphs(paragraphs);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setLoadingState('error');
    } finally {
      if(loadingState !== 'error') setLoadingState('idle');
    }
  }, [imageFile, loadingState]);

  const handleGenerateMindMap = useCallback(async (paragraph: string) => {
    setSelectedParagraph(paragraph);
    setLoadingState('generating');
    setError(null);
    try {
      const data = await generateMindMap(paragraph);
      setMindMapData(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setLoadingState('error');
    } finally {
      if(loadingState !== 'error') setLoadingState('idle');
    }
  }, [loadingState]);

  const loadingMessage = useMemo(() => {
    switch (loadingState) {
      case 'extracting':
        return 'Reading the textbook page...';
      case 'generating':
        return 'Generating your mind map...';
      default:
        return null;
    }
  }, [loadingState]);

  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setExtractedParagraphs(null);
    setSelectedParagraph(null);
    setMindMapData(null);
    setLoadingState('idle');
    setError(null);
  };
  
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
             <BrainIcon className="h-10 w-10 text-indigo-600"/>
             <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Mind Map Generator</h1>
          </div>
          <p className="mt-2 text-lg text-slate-600">Upload a textbook page and turn text into a visual learning tool.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input and Controls */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 mb-2">
                Step 1: Upload a Textbook Page
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-slate-400"/>
                  <div className="flex text-sm text-slate-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {imagePreview && (
              <>
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-800">Your Uploaded Page</h3>
                  <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                    <img src={imagePreview} alt="Textbook page preview" className="w-full h-auto object-contain max-h-96" />
                  </div>
                   <button
                      onClick={handleExtractText}
                      disabled={loadingState === 'extracting' || !imageFile}
                      className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Step 2: Extract Text
                    </button>
                </div>
              </>
            )}

            {extractedParagraphs && extractedParagraphs.length > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800">Step 3: Select a Paragraph to Map</h3>
                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2">
                  {extractedParagraphs.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleGenerateMindMap(p)}
                      disabled={loadingState === 'generating'}
                      className={`w-full text-left p-4 rounded-lg transition-all text-sm
                        ${selectedParagraph === p 
                          ? 'bg-indigo-100 text-indigo-900 ring-2 ring-indigo-500' 
                          : 'bg-slate-50 hover:bg-slate-100 hover:ring-2 hover:ring-slate-300'}`
                      }
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {extractedParagraphs && extractedParagraphs.length === 0 && loadingState === 'idle' &&
              <p className="text-center text-slate-500">No paragraphs could be extracted from the image.</p>
            }

          </div>
          
          {/* Right Column: Mind Map Output */}
          <div className="bg-white p-6 rounded-xl shadow-md min-h-[600px] flex flex-col">
            {mindMapData ? (
              <div className="border-b border-slate-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-slate-800 text-center">{mindMapData.name}</h2>
                {mindMapData.children && mindMapData.children.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-500 mb-2 text-center">Key Concepts:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {mindMapData.children.map((child, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {child.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Generated Mind Map</h2>
            )}
            <div className="w-full flex-grow flex items-center justify-center border-2 border-slate-200 border-dashed rounded-lg p-4">
              {loadingState === 'extracting' || loadingState === 'generating' ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">{loadingMessage}</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600">
                  <p className="font-semibold">An Error Occurred</p>
                  <p className="text-sm">{error}</p>
                  <button onClick={resetState} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Try Again</button>
                </div>
              ) : mindMapData ? (
                <MindMap data={mindMapData} />
              ) : (
                <div className="text-center text-slate-500">
                  <p>Your mind map will appear here once generated.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;