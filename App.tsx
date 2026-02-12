
import React, { useState, useCallback, useRef, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
import { AppState, Position } from './types';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppState>('asking');
  const [yesScale, setYesScale] = useState<number>(1);
  const [noPos, setNoPos] = useState<Position>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for mobile device/screen size
  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (stage === 'accepted' || !noBtnRef.current || !containerRef.current) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const noBtnRect = noBtnRef.current.getBoundingClientRect();
    const btnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const btnCenterY = noBtnRect.top + noBtnRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mouseX - btnCenterX, 2) + Math.pow(mouseY - btnCenterY, 2)
    );

    // If the mouse gets within 150 pixels (increased for safety) of the No button, move it
    if (distance < 150) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate a safe random position within the container bounds
      const margin = 80;
      const newX = Math.random() * (containerRect.width - noBtnRect.width - margin * 2) + margin;
      const newY = Math.random() * (containerRect.height - noBtnRect.height - margin * 2) + margin;

      setNoPos({ x: newX, y: newY });
    }
  }, [stage]);

  const handleYesHover = () => {
    setYesScale(prev => Math.min(prev + 0.25, 10)); // Cap it at 10x size
  };

  const handleYesClick = () => {
    setStage('accepted');
  };

  if (isMobile) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center p-8 bg-rose-50 text-center">
        <FloatingHearts />
        <div className="z-10 max-w-sm space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="text-6xl mb-4">💻</div>
          <h1 className="text-4xl font-cursive text-rose-600">A Little Surprise...</h1>
          <p className="text-rose-800 text-lg leading-relaxed">
            This special request contains interactive magic that works best on a 
            <span className="font-bold"> Laptop or Desktop</span>.
          </p>
          <p className="text-rose-400 text-sm italic">
            Please open this link on your computer for the full experience!
          </p>
          <div className="pt-4 text-2xl">💖🌹✨</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen flex flex-col items-center justify-center p-4 bg-rose-50 overflow-hidden"
    >
      <FloatingHearts />

      {stage === 'asking' ? (
        <div className="z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="relative mb-12">
            <img 
              src="https://picsum.photos/seed/valentine/400/300" 
              alt="Romantic placeholder" 
              className="rounded-3xl shadow-2xl border-4 border-white mx-auto transition-transform hover:scale-105 duration-300"
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border-2 border-rose-200">
              <span className="text-2xl">🌹✨💖</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-cursive text-rose-600 drop-shadow-sm">
            Will you be my Valentine?
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8 h-48">
            <button
              onClick={handleYesClick}
              onMouseEnter={handleYesHover}
              style={{ transform: `scale(${yesScale})` }}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-all duration-200 active:scale-95 text-xl z-20"
            >
              Yes!
            </button>

            <button
              ref={noBtnRef}
              style={{ 
                position: noPos.x !== 0 ? 'absolute' : 'relative',
                left: noPos.x !== 0 ? `${noPos.x}px` : 'auto',
                top: noPos.y !== 0 ? `${noPos.y}px` : 'auto',
                transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              className="bg-gray-200 text-gray-600 font-bold py-4 px-12 rounded-full shadow-md cursor-default pointer-events-none text-xl"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="z-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <img 
            src="https://picsum.photos/seed/love/400/400" 
            alt="Success" 
            className="rounded-full w-64 h-64 mx-auto border-8 border-rose-300 shadow-2xl object-cover"
          />
          <h1 className="text-6xl md:text-8xl font-cursive text-rose-600 mt-8">
            Yay! I knew it! ❤️
          </h1>
          <p className="text-xl md:text-2xl text-rose-400 font-medium">
            You've made me the happiest person today.
          </p>
          <div className="pt-8">
             <button 
                onClick={() => { setStage('asking'); setYesScale(1); setNoPos({x:0, y:0}); }}
                className="text-rose-300 hover:text-rose-500 underline text-sm transition-colors"
             >
                Start Over?
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
