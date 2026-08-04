import React, { useState, useEffect } from 'react';
import { Question } from '../../types/geography';
import WorldMap from '../WorldMap';
import EuropeMap from '../EuropeMap';
import BelgiumMap from '../BelgiumMap';
import { Language } from '../../utils/language';

interface MapQuizPlayerProps {
  question: Question;
  onResult: (isCorrect: boolean, chosenOption: string) => void;
  language?: Language;
  allowedItemIds?: string[];
}

export const MapQuizPlayer: React.FC<MapQuizPlayerProps> = ({ question, onResult, language, allowedItemIds }) => {
  const [attempts, setAttempts] = useState(0);
  const [wrongClicks, setWrongClicks] = useState<string[]>([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [userSelectedName, setUserSelectedName] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    setAttempts(0);
    setWrongClicks([]);
    setShowCorrectAnswer(false);
    setUserSelectedName('');
    setHasAnswered(false);
  }, [question.id]);

  const handleMapResult = (isCorrect: boolean, chosenLabel: string, clickedId: string) => {
    if (hasAnswered || showCorrectAnswer) return;

    setUserSelectedName(chosenLabel);

    if (isCorrect) {
      setHasAnswered(true);
      setTimeout(() => {
        onResult(attempts === 0, chosenLabel);
      }, 1000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setWrongClicks(prev => prev.includes(clickedId) ? prev : [...prev, clickedId]);

      if (newAttempts >= 2) {
        setHasAnswered(true);
        setShowCorrectAnswer(true);
        setTimeout(() => {
          onResult(false, chosenLabel);
        }, 1500);
      }
    }
  };

  const rawRegion = question.geoItem?.region || question.dataset;
  const targetId = question.targetId || question.geoItem?.id || '';
  const region = (rawRegion === 'belgium' || targetId.startsWith('be-'))
    ? 'belgium'
    : (rawRegion === 'europe' || targetId.startsWith('eu-'))
    ? 'europe'
    : 'world';

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold">
          Zoek: <span className="text-blue-600 dark:text-blue-400 underline decoration-2">{question.correctAnswer}</span>
        </h3>
        {userSelectedName && (
          <p className={`text-sm mt-2 font-medium ${hasAnswered && !showCorrectAnswer ? 'text-emerald-600' : 'text-rose-600'}`}>
            Jij klikte: {userSelectedName}
          </p>
        )}
      </div>

      <div className="w-full max-w-4xl bg-[#a9d4f9] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 relative shadow-xl">
        {region === 'world' && (
          <WorldMap
            activeQuestion={question}
            onResult={handleMapResult}
            interactiveMode={true}
            showCorrectAnswer={showCorrectAnswer}
            wrongItems={wrongClicks}
            language={language}
            allowedItemIds={allowedItemIds}
          />
        )}
        {region === 'europe' && (
          <EuropeMap
            activeQuestion={question}
            onResult={handleMapResult}
            interactiveMode={true}
            showCorrectAnswer={showCorrectAnswer}
            wrongItems={wrongClicks}
            language={language}
            allowedItemIds={allowedItemIds}
          />
        )}
        {region === 'belgium' && (
          <BelgiumMap
            activeQuestion={question}
            onResult={handleMapResult}
            interactiveMode={true}
            showCorrectAnswer={showCorrectAnswer}
            wrongItems={wrongClicks}
            language={language}
            allowedItemIds={allowedItemIds}
          />
        )}
      </div>
    </div>
  );
};
