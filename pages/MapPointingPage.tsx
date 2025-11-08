import React, { useState, useEffect, useMemo } from 'react';
import Maps from '../components/Maps';
import { worldGeo } from '../data/worldGeo';
import { indiaGeo } from '../data/indiaGeo';
import { worldLocations, indiaLocations, MapLocation } from '../data/mapData';
import { CheckCircleIcon, XCircleIcon } from '../components/Icons';

type MapType = 'world' | 'india';
type GameState = 'start' | 'playing' | 'feedback' | 'finished';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const MapPointingPage: React.FC = () => {
    const [activeMap, setActiveMap] = useState<MapType>('world');
    const [gameState, setGameState] = useState<GameState>('start');
    const [questions, setQuestions] = useState<MapLocation[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
    const [clickedCountryId, setClickedCountryId] = useState<string | null>(null);

    const { geoData, locations } = useMemo(() => {
        if (activeMap === 'world') {
            return { geoData: worldGeo, locations: worldLocations };
        }
        return { geoData: indiaGeo, locations: indiaLocations };
    }, [activeMap]);

    const currentQuestion = questions[currentQuestionIndex];

    const startGame = () => {
        setQuestions(shuffleArray(locations).slice(0, 5)); // 5 random questions
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameState('playing');
        setLastAnswerCorrect(null);
        setClickedCountryId(null);
    };

    const handleCountryClick = (countryId: string) => {
        if (gameState !== 'playing') return;

        const isCorrect = countryId === currentQuestion.id;
        setClickedCountryId(countryId);
        setLastAnswerCorrect(isCorrect);
        if (isCorrect) {
            setScore(score + 1);
        }
        setGameState('feedback');
    };

    const nextQuestion = () => {
        setClickedCountryId(null);
        setLastAnswerCorrect(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setGameState('playing');
        } else {
            setGameState('finished');
        }
    };
    
    // Reset game when map type changes
    useEffect(() => {
        setGameState('start');
    }, [activeMap]);

    const renderFeedback = () => {
        if (gameState !== 'feedback') return null;
        return (
            <div className={`mt-4 p-4 rounded-lg text-white flex items-center justify-between ${lastAnswerCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                <div className="flex items-center">
                    {lastAnswerCorrect ? <CheckCircleIcon className="w-6 h-6 mr-2" /> : <XCircleIcon className="w-6 h-6 mr-2" />}
                    <span className="font-semibold">
                        {lastAnswerCorrect ? "Correct!" : `Incorrect! That was ${clickedCountryId}. This is ${currentQuestion.name}.`}
                    </span>
                </div>
                <button onClick={nextQuestion} className="px-4 py-2 bg-white text-slate-800 rounded-md hover:bg-slate-100 font-semibold">
                    {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Map Pointing Challenge</h1>
            <p className="text-slate-600 mb-6">Test your geography skills! Select a map and point to the requested location.</p>

            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                {gameState === 'start' && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-slate-700 mb-4">Choose your map to begin</h2>
                         <div className="flex justify-center space-x-4 mb-6">
                            <button onClick={() => setActiveMap('world')} className={`px-6 py-2 rounded-md font-semibold ${activeMap === 'world' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>World Map</button>
                            <button onClick={() => setActiveMap('india')} className={`px-6 py-2 rounded-md font-semibold ${activeMap === 'india' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>India States</button>
                        </div>
                        <button onClick={startGame} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg text-lg hover:bg-indigo-700">
                            Start Game
                        </button>
                    </div>
                )}

                {(gameState === 'playing' || gameState === 'feedback') && currentQuestion && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-indigo-600">Point to: {currentQuestion.name}</h2>
                            <p className="text-lg font-semibold text-slate-600">Score: {score} / {questions.length}</p>
                        </div>
                        <div className="h-[500px]">
                            <Maps 
                                geoData={geoData} 
                                onCountryClick={handleCountryClick}
                                highlightCountry={gameState === 'feedback' && !lastAnswerCorrect ? clickedCountryId : null}
                                correctCountry={gameState === 'feedback' ? currentQuestion.id : null}
                            />
                        </div>
                        {renderFeedback()}
                    </div>
                )}
                
                {gameState === 'finished' && (
                     <div className="text-center">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Challenge Complete!</h2>
                        <p className="text-4xl font-bold text-indigo-600 mb-6">Your score: {score} / {questions.length}</p>
                        <button onClick={startGame} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg text-lg hover:bg-indigo-700">
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPointingPage;
