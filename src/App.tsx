import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const questions = [
  {
    q: "Siapa cowok yang lagi dekat sama kamu sekarang? (Ayo jujur!)",
    options: ["Reza Rahadian", "Jefri Nichol", "Muhamad Adrian", "Angga Yunanda"],
    correctIndex: 2
  },
  {
    q: "Makanan yang paling sering bikin kita bingung pas mau jalan?",
    options: ["Terserah", "Bebas", "Apa Aja", "Semua Benar"],
    correctIndex: 3
  },
  {
    q: "Siapa yang paling sayang banget sama Keishya?",
    options: ["Iaan", "Iaan banget", "Iaan selamanya", "Semua Benar"],
    correctIndex: 3
  }
];

function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 1, scale: Math.random() * 1.5 }}
          animate={{ y: window.innerHeight + 50, x: Math.random() * window.innerWidth, rotate: Math.random() * 360 }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "linear" }}
          className="absolute text-pink-500"
        >
          <Heart fill="currentColor" size={24} />
        </motion.div>
      ))}
    </div>
  );
}

function App() {
  const [step, setStep] = useState(-1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  const moveNoButton = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    setNoPosition({ x, y });
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-6 relative">
      {showConfetti && <Confetti />}
      
      <AnimatePresence mode="wait">
        {step === -1 && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center border border-white"
          >
            <h1 className="text-3xl font-bold text-pink-600 mb-4">Hai Keishya! 👋</h1>
            <p className="text-slate-700 mb-8 text-lg">Rian punya mini kuis nih buat kamu. Yuk mulai!</p>
            <button 
              onClick={() => setStep(0)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-pink-500/30 transition-transform active:scale-95"
            >
              Mulai Kuis
            </button>
          </motion.div>
        )}

        {step >= 0 && step < questions.length && (
          <motion.div 
            key={`q-${step}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full border border-white"
          >
            <div className="text-pink-400 font-bold mb-2 text-sm uppercase tracking-wider">Pertanyaan {step + 1} dari 3</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-tight">{questions[step].q}</h2>
            <div className="flex flex-col gap-3 relative h-[300px]">
              {questions[step].options.map((opt, i) => {
                const isWrongTrick = step === 0 && i !== questions[step].correctIndex;
                return (
                  <motion.button 
                    key={i}
                    onClick={() => {
                      if (!isWrongTrick) setStep(step + 1);
                    }}
                    onHoverStart={(e) => {
                      if (isWrongTrick) {
                        const btn = e.target as HTMLElement;
                        btn.style.position = 'absolute';
                        btn.style.left = `${Math.random() * 60}%`;
                        btn.style.top = `${Math.random() * 80}%`;
                      }
                    }}
                    className={`bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold py-4 px-6 rounded-2xl border border-pink-200 transition-colors text-left active:scale-[0.98] ${isWrongTrick ? 'z-20' : 'w-full relative z-10'}`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === questions.length && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center border border-white"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Skor Kamu: 100!</h1>
            <p className="text-pink-600 font-semibold text-lg mb-8">Karena kamu bener semua, ada hadiah spesial buat kamu...</p>
            <button 
              onClick={() => setStep(step + 1)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-pink-500/30 transition-transform active:scale-95"
            >
              Buka Hadiah 🎁
            </button>
          </motion.div>
        )}

        {step === questions.length + 1 && (
          <motion.div 
            key="confession"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center border border-white w-full max-w-sm relative z-10"
          >
            {showConfetti ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Heart className="mx-auto text-pink-500 fill-pink-500 mb-4" size={64} />
                <h1 className="text-3xl font-bold text-pink-600 mb-2">Yayyy! I Love You! ❤️</h1>
                <p className="text-slate-700">You are officially mine now, Keishya.</p>
              </motion.div>
            ) : (
              <>
                <Heart className="mx-auto text-pink-500 mb-6" size={48} />
                <h1 className="text-3xl font-bold text-slate-800 mb-4 leading-tight">Will you be my girlfriend?</h1>
                <p className="text-slate-600 mb-10">Iaan beneran sayang banget sama Keishya. Mau kan?</p>
                
                <div className="flex justify-center gap-6 relative h-16">
                  <button 
                    onClick={() => setShowConfetti(true)}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 z-20"
                  >
                    MAU ❤️
                  </button>
                  
                  <motion.button 
                    animate={{ x: noPosition.x, y: noPosition.y }}
                    onHoverStart={moveNoButton}
                    onClick={moveNoButton}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold py-3 px-8 rounded-full absolute z-10"
                    style={{ left: '60%' }}
                  >
                    NGGAK
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
