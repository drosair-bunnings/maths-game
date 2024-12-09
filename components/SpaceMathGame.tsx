{
  `path`: `components/SpaceMathGame.tsx`,
  `repo`: `maths-game`,
  `owner`: `drosair-bunnings`,
  `branch`: `main`,
  `content`: `import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Rocket, 
  Star, 
  Clock, 
  DollarSign,
  Sparkles,
  Award,
  AlarmCheck,
  Coins,
  Calculator
} from 'lucide-react';

const SpaceMathGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [gameType, setGameType] = useState('');
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const calculateTime = (time: string, addMinutes: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + addMinutes;
    if (totalMinutes >= 12 * 60) totalMinutes -= 12 * 60;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${newHours || 12}:${newMinutes.toString().padStart(2, '0')}`;
  };

  const generateProblem = useCallback((type: string) => {
    switch (type) {
      case 'money': {
        const dollars = Math.floor(Math.random() * 5) + 1;
        const cents = Math.floor(Math.random() * 100);
        const cents2 = Math.floor(Math.random() * 99) + 1;
        return {
          type: 'money',
          values: [`$${dollars}.${cents.toString().padStart(2, '0')}`, `${cents2}¢`],
          correctAnswer: (dollars + cents/100 + cents2/100).toFixed(2)
        };
      }
      case 'time': {
        const hours = Math.floor(Math.random() * 12) + 1;
        const minutes = Math.floor(Math.random() * 4) * 15;
        const duration = (Math.floor(Math.random() * 4) + 1) * 15;
        return {
          type: 'time',
          values: [`${hours}:${minutes.toString().padStart(2, '0')}`, `${duration}`],
          correctAnswer: calculateTime(`${hours}:${minutes}`, duration)
        };
      }
      case 'multiplication': {
        const max = Math.min(5 + level, 12);
        const num1 = Math.floor(Math.random() * max) + 1;
        const num2 = Math.floor(Math.random() * max) + 1;
        return {
          type: 'multiplication',
          num1,
          num2,
          correctAnswer: (num1 * num2).toString()
        };
      }
      default:
        return null;
    }
  }, [level]);

  const handleStartGame = (type: string) => {
    setGameType(type);
    const newProblem = generateProblem(type);
    setProblem(newProblem);
    setGameState('play');
    setAnswer('');
    setFeedback('');
    setShowHint(false);
    setShowGrid(false);
  };

  const handleCheckAnswer = () => {
    if (!problem) return;
    
    const correct = answer === problem.correctAnswer.toString();
    if (correct) {
      setFeedback('Amazing! Keep going! 🎉');
      setScore(score + (10 * level));
      setStreak(streak + 1);
      
      if (streak > 0 && streak % 5 === 0) {
        setStars(stars + 1);
        setLevel(prev => Math.min(prev + 1, 10));
        setGameState('celebration');
        setTimeout(() => {
          setGameState('play');
          setProblem(generateProblem(gameType));
          setAnswer('');
          setFeedback('');
        }, 3000);
      } else {
        setTimeout(() => {
          setProblem(generateProblem(gameType));
          setAnswer('');
          setFeedback('');
        }, 1000);
      }
    } else {
      setFeedback(`Not quite! Try again! The answer was ${problem.correctAnswer}`);
      setStreak(0);
    }
  };

  const MultiplicationGrid = ({ num1, num2 }: { num1: number; num2: number }) => {
    if (!showGrid) return null;

    return (
      <div className=\"relative p-6 bg-slate-900/80 backdrop-blur rounded-xl border border-purple-500\">
        <div className=\"text-center mb-4 text-white font-semibold\">
          {num1} rows × {num2} columns = {num1 * num2} dots
        </div>
        <div 
          className=\"grid gap-2 p-4\" 
          style={{ gridTemplateColumns: `repeat(${num2}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: num1 * num2 }).map((_, index) => (
            <div
              key={index}
              className=\"aspect-square rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg transform hover:scale-110 transition-all duration-300\"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 p-4\">
      <div className=\"max-w-2xl mx-auto\">
        {gameState === 'menu' && (
          <Card className=\"p-8 bg-slate-800 shadow-xl border-2 border-purple-500\">
            <div className=\"text-center space-y-8\">
              <h1 className=\"text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent\">
                Space Math Adventure
              </h1>
              <div className=\"flex justify-center\">
                <Rocket className=\"w-24 h-24 text-purple-400 animate-bounce\" />
              </div>
              <div className=\"space-y-4\">
                <button 
                  className=\"w-full text-lg p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center justify-center gap-2\"
                  onClick={() => handleStartGame('multiplication')}
                >
                  <Calculator className=\"w-6 h-6\" />
                  Multiplication Mission
                </button>
                <button 
                  className=\"w-full text-lg p-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg flex items-center justify-center gap-2\"
                  onClick={() => handleStartGame('money')}
                >
                  <Coins className=\"w-6 h-6\" />
                  Money Math Mission
                </button>
                <button 
                  className=\"w-full text-lg p-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg flex items-center justify-center gap-2\"
                  onClick={() => handleStartGame('time')}
                >
                  <Clock className=\"w-6 h-6\" />
                  Time Travel Challenge
                </button>
              </div>
              <div className=\"text-lg text-white\">
                Total Stars: {stars} <Star className=\"inline w-5 h-5 text-yellow-400\" />
              </div>
            </div>
          </Card>
        )}

        {gameState === 'play' && problem && (
          <Card className=\"p-6 bg-slate-800 shadow-xl border-2 border-purple-500\">
            <div className=\"space-y-6\">
              <div className=\"flex justify-between items-center text-white\">
                <div className=\"text-xl\">
                  Level {level} 
                  <Award className=\"inline ml-2 w-6 h-6 text-yellow-400\" />
                </div>
                <div className=\"text-xl\">
                  Score: {score}
                  <Star className=\"inline ml-2 w-6 h-6 text-yellow-400\" />
                </div>
                <div className=\"text-xl\">
                  Streak: {streak}
                  <Sparkles className=\"inline ml-2 w-6 h-6 text-yellow-400\" />
                </div>
              </div>

              <div className=\"text-center space-y-4\">
                <div className=\"text-2xl font-bold text-white\">
                  {gameType === 'money' ? (
                    <>Add: {problem.values[0]} + {problem.values[1]}</>
                  ) : gameType === 'time' ? (
                    <>What time will it be {problem.values[1]} minutes after {problem.values[0]}?</>
                  ) : (
                    <>{problem.num1} × {problem.num2}</>
                  )}
                </div>

                {gameType === 'multiplication' && (
                  <MultiplicationGrid num1={problem.num1} num2={problem.num2} />
                )}

                <div className=\"flex items-center justify-center gap-2\">
                  {gameType === 'money' ? (
                    <DollarSign className=\"w-6 h-6 text-green-400\" />
                  ) : gameType === 'time' ? (
                    <Clock className=\"w-6 h-6 text-blue-400\" />
                  ) : (
                    <Calculator className=\"w-6 h-6 text-purple-400\" />
                  )}
                  <input
                    type=\"text\"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
                    className=\"w-40 text-center text-2xl bg-slate-700 text-white border-2 border-purple-500 placeholder-gray-400 rounded-lg p-2\"
                    placeholder={gameType === 'money' ? '0.00' : gameType === 'time' ? '12:00' : ''}
                  />
                </div>

                <div className=\"flex justify-center gap-4\">
                  <button
                    onClick={handleCheckAnswer}
                    className=\"px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center gap-2\"
                  >
                    <AlarmCheck className=\"w-5 h-5\" />
                    Check Answer
                  </button>
                  {gameType === 'multiplication' && (
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className=\"px-4 py-2 border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white rounded-lg\"
                    >
                      {showGrid ? 'Hide' : 'Show'} Grid
                    </button>
                  )}
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className=\"px-4 py-2 border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white rounded-lg\"
                  >
                    Show Hint
                  </button>
                </div>

                {feedback && (
                  <div className={`text-xl font-bold ${
                    feedback.includes('Amazing') ? 'text-green-400' : 'text-orange-400'
                  } bg-slate-900 p-3 rounded-lg`}>
                    {feedback}
                  </div>
                )}

                <button
                  onClick={() => {
                    setGameState('menu');
                    setShowGrid(false);
                  }}
                  className=\"px-4 py-2 border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white rounded-lg\"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </Card>
        )}

        {showHint && (
          <Card className=\"mt-4 bg-slate-800 border-2 border-blue-500\">
            <div className=\"p-4 text-white\">
              {gameType === 'money' ? (
                <div className=\"space-y-2\">
                  <p>Tips for adding money:</p>
                  <p>1. First, convert cents to dollars (100¢ = $1.00)</p>
                  <p>2. Line up the decimal points</p>
                  <p>3. Add dollars and cents separately</p>
                </div>
              ) : gameType === 'time' ? (
                <div className=\"space-y-2\">
                  <p>Tips for calculating time:</p>
                  <p>1. Each quarter (15 min) moves the minute hand 3 numbers</p>
                  <p>2. 30 minutes is half way around the clock</p>
                  <p>3. Count by 15s: 15, 30, 45, 60 (new hour)</p>
                </div>
              ) : (
                <div className=\"space-y-2\">
                  <p>Tips for multiplication:</p>
                  <p>1. Use the grid to visualize the problem</p>
                  <p>2. Break it down into smaller groups</p>
                  <p>3. Remember: 4 × 3 is like adding 4 three times</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {gameState === 'celebration' && (
          <div className=\"fixed inset-0 flex items-center justify-center bg-black bg-opacity-90\">
            <div className=\"text-center space-y-4 bg-slate-800 p-8 rounded-xl border-2 border-yellow-400\">
              <h2 className=\"text-4xl font-bold text-white\">
                Incredible! 🎉
              </h2>
              <p className=\"text-2xl text-yellow-400\">
                You earned a star and reached level {level}! ⭐
              </p>
              <Rocket className=\"w-24 h-24 text-purple-400 animate-bounce mx-auto\" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceMathGame;`,
  `message`: `Add SpaceMathGame component`
}
