import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Sparkles, Send } from 'lucide-react';

const questions = [
  {
    q: "Siapa cowok yang lagi dekat sama kamu sekarang? (Ayo jujur!)",
    waMessage: "Halo Iaan ganteng, bantuin jawab kuis dong! Siapa sih cowok yang lagi deket sama aku?"
  },
  {
    q: "Tempat mana yang paling sering jadi bahan perdebatan kita kalau lagi ngebahas mau jalan?",
    waMessage: "Iaan, kita kan belum pernah jalan berdua, tapi udah sering debat mau kemana. Emang tempat apa sih yang sering kita debatin?"
  },
  {
    q: "Apa hal yang paling aku suka dari kamu?",
    waMessage: "Iaan! Jawab jujur, kamu paling suka bagian apa dari aku? Biar bener nih kuisnya!"
  },
  {
    q: "Kalau aku lagi kangen banget sama kamu, biasanya aku ngapain coba?",
    waMessage: "Bey, kalau kamu lagi kangen aku biasanya ngapain sih? Buka tutup WA nungguin aku online ya? Ngaku!"
  },
  {
    q: "Siapa cowok yang paling sayang bangeeet sama kamu?",
    waMessage: "Pertanyaan terakhir nih! Siapa yang paling sayang sama aku di dunia ini? Pasti kamu kan?"
  }
];

function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
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

// Millionaire style hexagonal button
function HexagonButton({ children, className = "", onClick, onHoverStart, style }: any) {
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={onHoverStart}
      style={style}
      className={`relative group active:scale-95 transition-transform ${className}`}
    >
      {/* Outer Gold Border */}
      <div 
        className="w-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 p-[2px]"
        style={{ clipPath: 'polygon(1rem 0%, calc(100% - 1rem) 0%, 100% 50%, calc(100% - 1rem) 100%, 1rem 100%, 0% 50%)' }}
      >
        {/* Inner Dark Blue Button */}
        <div 
          className="w-full bg-[#04081c] group-hover:bg-[#1a2c79] transition-colors flex items-center justify-center px-4 md:px-6 py-4"
          style={{ clipPath: 'polygon(calc(1rem - 1px) 0%, calc(100% - calc(1rem - 1px)) 0%, 100% 50%, calc(100% - calc(1rem - 1px)) 100%, calc(1rem - 1px) 100%, 0% 50%)' }}
        >
          {children}
        </div>
      </div>
    </motion.button>
  );
}

function App() {
  const [step, setStep] = useState(-1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Essay state
  const [currentInput, setCurrentInput] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);

  const moveNoButton = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 250 - 150;
    setNoPosition({ x, y });
  };

  const isFirstQuestionTrickActive = () => {
    if (step !== 0) return false;
    const text = currentInput.toLowerCase();
    // Valid if she types 'adrian', 'iaan', 'rian', or 'muhamad'
    const isValid = text.includes('adrian') || text.includes('iaan') || text.includes('rian') || text.includes('muhamad');
    return !isValid;
  };

  const handleNext = () => {
    if (currentInput.trim() === "") {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    if (isFirstQuestionTrickActive()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    setAnswers([...answers, currentInput]);
    setCurrentInput("");
    setShowError(false);
    setNoPosition({ x: 0, y: 0 });
    setStep(step + 1);
  };

  const handleSendToWhatsApp = () => {
    let text = "Halo Iaan! Ini jawaban essay dari Keishya:\n\n";
    answers.forEach((ans, i) => {
      text += `*Pertanyaan ${i+1}:* ${questions[i].q}\n*Jawaban:* ${ans}\n\n`;
    });
    text += "Tunggu apa lagi? Buruan bales chat ini!";
    
    window.open(`https://wa.me/6281338219957?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-[#03061A] to-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background ambient lights */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      {showConfetti && <Confetti />}
      
      <AnimatePresence mode="wait">
        {step === -1 && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.2 }}
            className="text-center z-10 max-w-2xl w-full flex flex-col items-center"
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mb-8"
            >
              <Trophy className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" size={80} />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-6 drop-shadow-xl font-serif text-center uppercase tracking-wider">
              Who Wants to Be<br/>Iaan's Girlfriend?
            </h1>
            <p className="text-blue-200 mb-10 text-lg tracking-wide">
              Selamat datang Keishya! Buktikan kalau kamu memang pantas. Jawab kuis essay ini dari hati kamu.
            </p>
            <HexagonButton onClick={() => setStep(0)} className="w-64 mx-auto">
              <span className="w-full text-center text-white font-bold text-lg tracking-widest">MULAI KUIS</span>
            </HexagonButton>
          </motion.div>
        )}

        {step >= 0 && step < questions.length && (
          <motion.div 
            key={`q-${step}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-4xl z-10 flex flex-col items-center relative"
          >
            {/* Lifeline: Phone a Friend */}
            <div className="absolute -top-16 right-0 md:-top-20 z-20">
              <button 
                onClick={() => window.open(`https://wa.me/6281338219957?text=${encodeURIComponent(questions[step].waMessage)}`, '_blank')}
                className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border-2 border-yellow-500 text-yellow-400 font-bold py-2 px-4 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all active:scale-95 group"
              >
                <div className="bg-yellow-500 text-slate-900 p-1.5 rounded-full group-hover:animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <span className="hidden sm:inline">Phone a Friend</span>
                <span className="sm:hidden">Bantuan</span>
              </button>
            </div>

            {/* Question Display */}
            <div className="w-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 p-[2px] mb-8 shadow-[0_0_30px_rgba(250,204,21,0.2)] mt-8" style={{ clipPath: 'polygon(2rem 0%, calc(100% - 2rem) 0%, 100% 50%, calc(100% - 2rem) 100%, 2rem 100%, 0% 50%)' }}>
              <div className="w-full bg-[#020513] text-center px-12 py-8 min-h-[120px] flex items-center justify-center relative overflow-hidden" style={{ clipPath: 'polygon(calc(2rem - 1px) 0%, calc(100% - calc(2rem - 1px)) 0%, 100% 50%, calc(100% - calc(2rem - 1px)) 100%, calc(2rem - 1px) 100%, 0% 50%)' }}>
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                <h2 className="text-xl md:text-3xl font-bold text-white leading-relaxed z-10">
                  {questions[step].q}
                </h2>
              </div>
            </div>

            {/* Essay Input */}
            <motion.div 
              animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl mb-8 relative"
            >
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Ketik jawaban kamu di sini..."
                className={`w-full bg-[#04081c]/80 border-2 ${showError ? 'border-red-500 focus:border-red-500' : 'border-yellow-600/50 focus:border-yellow-400'} rounded-2xl p-6 text-white text-lg min-h-[150px] shadow-inner focus:outline-none focus:ring-4 focus:ring-yellow-500/20 backdrop-blur-sm transition-all resize-none`}
              />
              {showError && (
                <p className="text-red-400 text-sm mt-2 font-semibold absolute -bottom-8 left-0 w-full text-center">
                  {currentInput.trim() === "" ? "Jawaban nggak boleh kosong!" : "Tetot! Ayo jujur, pasti orang lain kan? Coba isi yang bener!"}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <div className="w-full relative h-20 flex justify-center mt-4">
              <div 
                className={`absolute z-10 w-64 ${isFirstQuestionTrickActive() && currentInput.trim() !== "" ? '' : 'transition-none'}`}
                style={isFirstQuestionTrickActive() && currentInput.trim() !== "" ? { transform: `translate(${noPosition.x}px, ${noPosition.y}px)`, transition: 'transform 0.2s ease-out' } : {}}
              >
                <HexagonButton 
                  onClick={handleNext}
                  onHoverStart={() => { if (isFirstQuestionTrickActive() && currentInput.trim() !== "") moveNoButton(); }}
                  className="w-full"
                >
                  <span className="w-full text-center text-white font-bold text-lg tracking-widest flex items-center justify-center gap-2">
                    KUNCI JAWABAN
                  </span>
                </HexagonButton>
              </div>
            </div>
          </motion.div>
        )}

        {step === questions.length && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-center z-10 max-w-2xl w-full flex flex-col items-center"
          >
            <div className="text-6xl mb-6">🏆</div>
            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-4 drop-shadow-xl font-serif">
              SKOR: Rp 1.000.000.000,-
            </h1>
            <p className="text-blue-200 mb-10 text-lg">Kamu berhasil ngejawab semuanya dengan jujur! Sekarang klaim hadiah utamanya...</p>
            <HexagonButton onClick={() => setStep(step + 1)} className="w-64 mx-auto">
              <span className="w-full flex items-center justify-center gap-2 text-white font-bold text-lg tracking-widest"><Sparkles size={20}/> KLAIM HADIAH</span>
            </HexagonButton>
          </motion.div>
        )}

        {step === questions.length + 1 && (
          <motion.div 
            key="confession"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl z-10 flex flex-col items-center"
          >
            {showConfetti ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                <Heart className="mx-auto text-pink-500 fill-pink-500 mb-6 drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" size={100} />
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Yayyy! I Love You! ❤️</h1>
                <p className="text-blue-200 text-xl mb-8">You are officially mine now, Keishya.</p>
                
                <HexagonButton onClick={handleSendToWhatsApp} className="w-72 mx-auto">
                  <span className="w-full flex items-center justify-center gap-2 text-white font-bold text-lg">
                    KIRIM JAWABAN KE IAAN <Send size={18}/>
                  </span>
                </HexagonButton>
              </motion.div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <Heart className="text-pink-500 fill-pink-500/20 mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]" size={64} />
                
                <div className="w-full bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 p-[2px] mb-12 shadow-[0_0_30px_rgba(236,72,153,0.4)]" style={{ clipPath: 'polygon(2rem 0%, calc(100% - 2rem) 0%, 100% 50%, calc(100% - 2rem) 100%, 2rem 100%, 0% 50%)' }}>
                  <div className="w-full bg-[#020513] text-center px-6 py-10 flex flex-col items-center justify-center relative overflow-hidden" style={{ clipPath: 'polygon(calc(2rem - 1px) 0%, calc(100% - calc(2rem - 1px)) 0%, 100% 50%, calc(100% - calc(2rem - 1px)) 100%, calc(2rem - 1px) 100%, 0% 50%)' }}>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">Will you be my girlfriend?</h1>
                    <p className="text-pink-200">Iaan beneran sayang banget sama Keishya. Mau kan?</p>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 w-full px-4 relative h-32 md:h-20">
                  <div className="w-1/2 md:w-64 relative z-20">
                    <HexagonButton onClick={() => setShowConfetti(true)}>
                      <span className="w-full text-center text-white font-bold text-xl">MAU ❤️</span>
                    </HexagonButton>
                  </div>
                  
                  <div 
                    className="w-1/2 md:w-64 absolute right-4 md:right-1/2 md:-mr-32 z-10"
                    style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)`, transition: 'transform 0.2s ease-out' }}
                  >
                    <HexagonButton 
                      onHoverStart={moveNoButton}
                      onClick={moveNoButton}
                    >
                      <span className="w-full text-center text-white/50 font-bold text-xl">NGGAK</span>
                    </HexagonButton>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
