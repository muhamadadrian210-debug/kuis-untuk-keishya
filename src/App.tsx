import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Sparkles, Send } from 'lucide-react';
import YouTube, { type YouTubeEvent } from 'react-youtube';

const photos = Array.from({ length: 8 }, (_, i) => `/photos/${i + 1}.jpg`);

const lyrics = [
  { text: "I'm here with my confession", translation: "Aku di sini dengan pengakuanku", start: 132.8, end: 138.4 },
  { text: "Got nothing to hide no more", translation: "Tidak ada lagi yang disembunyikan", start: 138.4, end: 144.0 },
  { text: "I don't know where to start", translation: "Aku tidak tahu harus mulai dari mana", start: 144.0, end: 148.0 },
  { text: "But to show you the shape of my heart", translation: "Selain menunjukkan bentuk hatiku", start: 148.0, end: 157.0 },
  { text: "I'm lookin' back on things I've done", translation: "Melihat kembali hal-hal yang t'lah kulakukan", start: 157.0, end: 162.5 },
  { text: "I never wanna play the same old part", translation: "Aku tak ingin lagi memainkan peran yang sama", start: 162.5, end: 168.0 },
  { text: "I'll keep you in the dark (keep you in the dark)", translation: "Aku akan menyembunyikannya darimu (menyembunyikannya darimu)", start: 168.0, end: 172.5 },
  { text: "Now let me show you the shape of my heart", translation: "Sekarang biarkan aku menunjukkan bentuk hatiku", start: 172.5, end: 177.0 },
  { text: "Looking back on the things I've done", translation: "Melihat kembali pada hal-hal yang t'lah kulakukan", start: 177.0, end: 181.0 },
  { text: "I was trying to be someone (trying to be someone)", translation: "Aku mencoba menjadi seseorang (mencoba menjadi seseorang)", start: 181.0, end: 185.0 },
  { text: "I played my part, kept you in the dark", translation: "Aku memainkan peranku, menyembunyikannya darimu", start: 185.0, end: 191.0 },
  { text: "Now let me show you the shape of my heart", translation: "Sekarang biarkan aku menunjukkan bentuk hatiku", start: 191.0, end: 196.5 },
  { text: "(Now let me show you the true shape of my heart)", translation: "(Sekarang biarkan aku menunjukkan bentuk asliku)", start: 196.5, end: 206.0 },
];

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
    q: "Jujur, apa hal yang paling kamu suka dari aku (Iaan)?",
    waMessage: "Iaan, kuisnya nanya bagian apa yang paling aku suka dari kamu. Aku bingung mau jawab apa, kamu terlalu sempurna sih wkwk. Bantuin dong!"
  },
  {
    q: "Kalau kamu lagi kangen banget sama aku, biasanya kamu ngapain coba ngaku?",
    waMessage: "Iaan, kalau aku kangen kamu aku kan cuma bisa buka tutup WA nungguin kamu online... Eh kok kuisnya tau sih? Bantuin jawab dong!"
  },
  {
    q: "Siapa cowok yang bakal selalu sayang dan jagain kamu selamanya?",
    waMessage: "Pertanyaan terakhir nih! Cowok yang bakal selalu sayang sama aku itu... pasti kamu kan Iaan? ❤️"
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
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [waitingDateStr, setWaitingDateStr] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Essay state
  const [currentInput, setCurrentInput] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [player, setPlayer] = useState<any>(null);
  const [isSongFinished, setIsSongFinished] = useState(false);

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target.playVideo();
  };

  useEffect(() => {
    if (!player || !isPlayingMusic) return;
    
    const interval = setInterval(() => {
      const time = player.getCurrentTime();
      
      if (time > 206 && !isSongFinished) {
        setIsSongFinished(true);
      }
      
      const index = lyrics.findIndex(l => time >= l.start && time < l.end);
      if (index !== -1 && index !== currentLyricIndex) {
        setCurrentLyricIndex(index);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [player, isPlayingMusic, currentLyricIndex]);

  const moveNoButton = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 250 - 150;
    setNoPosition({ x, y });
  };

  const isTrickActive = () => {
    // Trick applies to Question 1 (step 0) and Question 5 (step 4)
    if (step !== 0 && step !== 4) return false;
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

    if (isTrickActive()) {
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
    text += "Aku MAU jadi pacar kamu! Tunggu apa lagi? Buruan bales chat ini! ❤️";
    
    const whatsappUrl = `https://wa.me/6281338219957?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendTimeRequest = () => {
    if (!selectedDate) return;
    
    const dateObj = new Date(selectedDate);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('id-ID', options);
    
    setWaitingDateStr(formattedDate);
    setShowTimeModal(false);
    setStep(100); // Trigger the waiting step view
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
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
                className={`absolute z-10 w-64 ${isTrickActive() && currentInput.trim() !== "" ? '' : 'transition-none'}`}
                style={isTrickActive() && currentInput.trim() !== "" ? { transform: `translate(${noPosition.x}px, ${noPosition.y}px)`, transition: 'transform 0.2s ease-out' } : {}}
              >
                <HexagonButton 
                  onClick={handleNext}
                  onHoverStart={() => { if (isTrickActive() && currentInput.trim() !== "") moveNoButton(); }}
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
            className="w-full max-w-2xl z-10 flex flex-col items-center relative"
          >
            {/* Invisible YouTube Player - Moved outside ternary to prevent unmounting */}
            {isPlayingMusic && (
              <div className="hidden">
                <YouTube 
                  videoId="OT5msu-dap8" 
                  opts={{ playerVars: { autoplay: 1, start: 132, playsinline: 1 } }} 
                  onReady={onReady} 
                />
              </div>
            )}

            {showConfetti ? (
              <>
                {/* Scattered Photos Animation */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                  {photos.map((src, i) => {
                    // Predefined positions to frame the center
                    const mobilePositions = [
                      { left: '-2%', top: '2%', rotate: -15 },
                      { right: '-2%', top: '5%', rotate: 12 },
                      { left: '-2%', bottom: '2%', rotate: -10 },
                      { right: '-2%', bottom: '5%', rotate: 15 },
                      { left: '-8%', top: '35%', rotate: -5 },
                      { right: '-8%', top: '40%', rotate: 8 },
                      { left: '5%', top: '-5%', rotate: -12 },
                      { right: '5%', top: '-3%', rotate: 14 },
                      { left: '5%', bottom: '-2%', rotate: 10 },
                      { right: '5%', bottom: '-2%', rotate: -8 },
                    ];

                    const desktopPositions = [
                      { left: '2%', top: '5%', rotate: -15 },
                      { right: '2%', top: '8%', rotate: 12 },
                      { left: '5%', bottom: '5%', rotate: -10 },
                      { right: '5%', bottom: '8%', rotate: 15 },
                      { left: '8%', top: '40%', rotate: -5 },
                      { right: '8%', top: '45%', rotate: 8 },
                      { left: '25%', top: '-2%', rotate: -12 },
                      { right: '25%', top: '-1%', rotate: 14 },
                      { left: '20%', bottom: '0%', rotate: 10 },
                      { right: '20%', bottom: '2%', rotate: -8 },
                    ];
                    
                    const positions = isMobile ? mobilePositions : desktopPositions;
                    
                    const pos = positions[i % positions.length];
                    
                    return (
                      <motion.img
                        key={i}
                        src={src}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 0.8,
                        }}
                        transition={{ 
                          duration: 0.8,
                          delay: i * 0.1,
                          type: "spring",
                          bounce: 0.5
                        }}
                        style={{
                          ...pos,
                          transform: `rotate(${pos.rotate}deg)`
                        }}
                        onClick={() => setSelectedPhoto(src)}
                        className="pointer-events-auto cursor-pointer absolute w-24 h-32 md:w-40 md:h-56 object-cover rounded-xl border-4 border-white/80 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:opacity-100 hover:z-50 transition-opacity"
                      />
                    );
                  })}
                </div>

                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center bg-black/60 p-8 rounded-3xl backdrop-blur-md border border-pink-500/30 z-20 relative mt-20 md:mt-10">
                  <Heart className="mx-auto text-pink-500 fill-pink-500 mb-6 drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" size={100} />
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Yayyy! I Love You! ❤️</h1>
                  <p className="text-blue-200 text-xl mb-4">You are officially mine now, Keishya.</p>
                  
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-pink-300 font-medium mb-8 text-sm md:text-base border border-pink-500/30 rounded-full px-4 py-1.5 inline-block bg-pink-500/10"
                  >
                    ✨ Coba klik foto-foto kita di pinggir layar deh! 📸 ✨
                  </motion.p>
                  
                  {isSongFinished ? (
                    <HexagonButton onClick={handleSendToWhatsApp} className="w-72 mx-auto">
                      <span className="w-full flex items-center justify-center gap-2 text-white font-bold text-lg pointer-events-auto">
                        KIRIM JAWABAN KE IAAN <Send size={18}/>
                      </span>
                    </HexagonButton>
                  ) : (
                    <div className="w-72 mx-auto text-center border-2 border-pink-500/30 bg-pink-900/40 p-4 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                      <p className="text-pink-200 text-sm md:text-base font-semibold tracking-wide drop-shadow-sm">
                        Tombol kirim jawaban akan muncul setelah lagunya habis ya sayang... Dengerin dulu sampai habis ❤️🥺
                      </p>
                    </div>
                  )}
                  
                  {currentLyricIndex >= 0 && currentLyricIndex < lyrics.length && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentLyricIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 p-4 bg-black/40 rounded-xl border border-pink-500/20 backdrop-blur-sm"
                      >
                        <p className="text-white text-xl md:text-2xl font-bold tracking-wide shadow-black drop-shadow-md">
                          {lyrics[currentLyricIndex].text}
                        </p>
                        <p className="text-pink-300 text-sm md:text-base italic mt-1 drop-shadow-sm">
                          {lyrics[currentLyricIndex].translation}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </motion.div>
              </>
            ) : (
              <div className="w-full flex flex-col items-center">
                <Heart className="text-pink-500 fill-pink-500/20 mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]" size={64} />
                
                <div className="w-full bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 p-[2px] mb-8 shadow-[0_0_30px_rgba(236,72,153,0.4)]" style={{ clipPath: 'polygon(2rem 0%, calc(100% - 2rem) 0%, 100% 50%, calc(100% - 2rem) 100%, 2rem 100%, 0% 50%)' }}>
                  <div className="w-full bg-[#020513] text-center px-6 py-10 flex flex-col items-center justify-center relative overflow-hidden" style={{ clipPath: 'polygon(calc(2rem - 1px) 0%, calc(100% - calc(2rem - 1px)) 0%, 100% 50%, calc(100% - calc(2rem - 1px)) 100%, calc(2rem - 1px) 100%, 0% 50%)' }}>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">Will you be my girlfriend?</h1>
                    <p className="text-pink-200">Iaan beneran sayang banget sama Keishya. Mau kan?</p>
                  </div>
                </div>
                
                {!isPlayingMusic && (
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mb-2 text-pink-300 font-semibold text-center text-sm md:text-base drop-shadow-md"
                  >
                    👇 Wajib putar lagu ini dulu sayang, baru tekan MAU 👇
                  </motion.div>
                )}

                <button 
                  onClick={() => setIsPlayingMusic(true)}
                  className={`mb-8 flex items-center gap-2 px-6 py-2 rounded-full border-2 border-pink-500 text-pink-400 hover:bg-pink-500/20 transition-colors ${isPlayingMusic ? 'hidden' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  Putar Lagu Romantis 🎵
                </button>
                
                <div className="flex justify-center gap-4 w-full px-4 relative h-32 md:h-20">
                  <div className="w-1/2 md:w-64 relative z-20">
                    <HexagonButton onClick={() => setShowConfetti(true)}>
                      <span className="w-full text-center text-white font-bold text-xl">MAU ❤️</span>
                    </HexagonButton>
                  </div>
                  
                  <div 
                    className="w-1/2 md:w-64 absolute z-30 transition-all duration-200"
                    style={{ right: '1rem', transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
                    onMouseEnter={moveNoButton}
                    onTouchStart={(e: any) => { e.preventDefault(); moveNoButton(); }}
                    onClick={moveNoButton}
                  >
                    <HexagonButton className="w-full opacity-80" onClick={(e: any) => { e.preventDefault(); moveNoButton(); }}>
                      <span className="w-full flex items-center justify-center gap-2 text-white/70 font-bold text-lg md:text-2xl">
                        NGGAK 💔
                      </span>
                    </HexagonButton>
                  </div>
                </div>

                <div className="mt-8 text-center relative z-20">
                  <button 
                    onClick={() => setShowTimeModal(true)}
                    className="text-pink-300/80 hover:text-pink-300 text-sm md:text-base underline decoration-dashed underline-offset-4 transition-colors"
                  >
                    Butuh waktu buat mikir dulu 🤔
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 100 && (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md z-10 flex flex-col items-center relative mt-20"
          >
            <div className="text-center bg-black/60 p-8 rounded-3xl backdrop-blur-md border border-pink-500/30 z-20 relative shadow-[0_0_40px_rgba(236,72,153,0.2)]">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Take your time... 🥺</h1>
              <p className="text-pink-200 text-lg mb-4 leading-relaxed">
                Oke Keishya, Iaan bakal sabar nungguin jawaban kamu sampai tanggal <b className="text-white bg-pink-500/20 px-2 py-1 rounded">{waitingDateStr}</b>.
              </p>
              <p className="text-pink-300/80 text-sm mb-8">Jangan lupa kabarin Iaan ya nanti!</p>
              
              <HexagonButton onClick={() => {
                const message = `Iaan, aku butuh waktu buat mikir dulu ya... Kasih aku waktu sampai tanggal ${waitingDateStr}. Nanti aku kasih jawaban pastinya.`;
                const whatsappUrl = `https://wa.me/6281338219957?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }} className="w-full">
                <span className="w-full flex items-center justify-center gap-2 text-white font-bold text-base md:text-lg">
                  KIRIM PESAN KE IAAN <Send size={18}/>
                </span>
              </HexagonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTimeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0f172a] border border-pink-500/30 p-6 md:p-8 rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.3)] max-w-sm w-full relative"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Butuh waktu?</h2>
              <p className="text-pink-200 mb-4 text-sm">Nggak apa-apa kok. Kasih tau Iaan ya kamu butuh waktu sampai kapan (Maksimal 2 minggu yaa 🥺)</p>
              
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 mb-6 text-left">
                <p className="text-yellow-400 text-xs md:text-sm font-bold mb-1">⚠️ Tidak Direkomendasikan!</p>
                <p className="text-yellow-200/80 text-xs">Karena Iaan udah nggak sabar pengen bahagiain Keishya tiap hari! Tapi kalau emang butuh waktu, Iaan bakal sabar nungguin kok.</p>
              </div>
              
              <input 
                type="date" 
                min={today}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-black/50 border border-pink-500/50 rounded-lg p-3 text-white mb-6 focus:outline-none focus:border-pink-400"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowTimeModal(false)}
                  className="flex-1 py-2 px-4 rounded-lg border border-pink-500/50 text-pink-300 hover:bg-pink-500/10 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSendTimeRequest}
                  disabled={!selectedDate}
                  className="flex-1 py-2 px-4 rounded-lg bg-pink-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-500 transition-colors flex items-center justify-center gap-2"
                >
                  Kirim <Send size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: Math.random() * 6 - 3, opacity: 1 }}
              exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e: any) => e.stopPropagation()}
              className="bg-white p-4 pb-16 md:p-6 md:pb-24 rounded-sm shadow-2xl relative max-w-sm w-full cursor-default"
            >
              <img src={selectedPhoto} alt="Polaroid" className="w-full h-auto object-cover border border-gray-200" />
              <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center">
                <span className="text-gray-800 font-handwriting text-xl md:text-3xl">For Keishya ❤️</span>
              </div>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-pink-600 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
