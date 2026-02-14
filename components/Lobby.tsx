import React from 'react';
import { Brain, Zap } from 'lucide-react';
import { Question } from '../types';

interface LobbyProps {
  onQuizGenerated: (questions: Question[]) => void;
}

// ------------------------------------------------------------------
// EDIT THIS ARRAY TO ADD YOUR QUESTIONS, IMAGES, AND VIDEOS
// ------------------------------------------------------------------
export const STATIC_QUIZ: Question[] = [
  {
    id: 'q5',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q5_opt1', text: 'Human', isCorrect: false },
      { id: 'q5_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'video',
    mediaUrl: '/media/znmd.mp4'
  },
  {
    id: 'q1',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q1_opt1', text: 'Human', isCorrect: false },
      { id: 'q1_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'video',
    mediaUrl: '/media/22a23254-38b6-4f7d-8f24-40e0f62283f6.mp4'
  },
  {
    id: 'q2',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q2_opt1', text: 'Human', isCorrect: false },
      { id: 'q2_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'video',
    mediaUrl: '/media/cave.mp4'
  },
  {
    id: 'q3',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q3_opt1', text: 'Human', isCorrect: false },
      { id: 'q3_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'video',
    mediaUrl: '/media/Sports.mp4'
  },
  {
    id: 'q4',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q4_opt1', text: 'Human', isCorrect: false },
      { id: 'q4_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'video',
    mediaUrl: '/media/pizza.mp4'
  },
  {
    id: 'q6',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q6_opt1', text: 'Human', isCorrect: true },
      { id: 'q6_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'image',
    mediaUrl: '/media/1.png'
  },
  {
    id: 'q7',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q7_opt1', text: 'Human', isCorrect: true },
      { id: 'q7_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'image',
    mediaUrl: '/media/2.png'
  },
  {
    id: 'q8',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q8_opt1', text: 'Human', isCorrect: true },
      { id: 'q8_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'video',
    mediaUrl: '/media/nature.mp4'
  },
  {
    id: 'q10',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q10_opt1', text: 'Human', isCorrect: true },
      { id: 'q10_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'video',
    mediaUrl: '/media/land.mp4'
  },
  {
    id: 'q11',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q11_opt1', text: 'Human', isCorrect: true },
      { id: 'q11_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'video',
    mediaUrl: '/media/morning.mp4'
  },
  {
    id: 'q12',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q12_opt1', text: 'Human', isCorrect: true },
      { id: 'q12_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'video',
    mediaUrl: '/media/sky.mp4'
  },
  {
    id: 'q13',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q13_opt1', text: 'Human', isCorrect: false },
      { id: 'q13_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'image',
    mediaUrl: '/media/image.png'
  },
  {
    id: 'q14',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q14_opt1', text: 'Human', isCorrect: false },
      { id: 'q14_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'image',
    mediaUrl: '/media/image1.png'
  },
  {
    id: 'q15',
    text: 'This website/app was primarily made by?',
    options: [
      { id: 'q15_opt1', text: 'Human', isCorrect: false },
      { id: 'q15_opt2', text: 'AI', isCorrect: true }
    ],
    websiteLabel: 'Halaska Studio',
    websiteUrl: 'https://halaskastudio.com/'
  },
  {
    id: 'q16',
    text: 'This website/app was primarily made by?',
    options: [
      { id: 'q16_opt1', text: 'Human', isCorrect: false },
      { id: 'q16_opt2', text: 'AI', isCorrect: true }
    ],
    websiteLabel: 'Jackie Zhang',
    websiteUrl: 'https://jackiezhang.co.za/'
  },
  {
    id: 'q17',
    text: 'This website/app was primarily made by?',
    options: [
      { id: 'q17_opt1', text: 'Human', isCorrect: true },
      { id: 'q17_opt2', text: 'AI', isCorrect: false }
    ],
    websiteLabel: "Humanity's Last Machine",
    websiteUrl: 'https://www.humanityslastmachine.com/'
  },
  {
    id: 'q18',
    text: 'This website/app was primarily made by?',
    options: [
      { id: 'q18_opt1', text: 'Human', isCorrect: false },
      { id: 'q18_opt2', text: 'AI', isCorrect: true }
    ],
    websiteLabel: 'anime.js',
    websiteUrl: 'https://animejs.com/'
  },
  {
    id: 'q19',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q19_opt1', text: 'Human', isCorrect: true },
      { id: 'q19_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'image',
    mediaUrl: '/media/3.png'
  },
  {
    id: 'q20',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q20_opt1', text: 'Human', isCorrect: false },
      { id: 'q20_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'audio',
    mediaUrl: '/media/audio1.mp3'
  },
  {
    id: 'q21',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q21_opt1', text: 'Human', isCorrect: true },
      { id: 'q21_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'audio',
    mediaUrl: '/media/audio2.mp3'
  },
  {
    id: 'q22',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q22_opt1', text: 'Human', isCorrect: true },
      { id: 'q22_opt2', text: 'AI', isCorrect: false }
    ],
    mediaType: 'audio',
    mediaUrl: '/media/audio3.mp3'
  },
  {
    id: 'q23',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q23_opt1', text: 'Human', isCorrect: false },
      { id: 'q23_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'audio',
    mediaUrl: '/media/audio4.mp3'
  },
  {
    id: 'q24',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q24_opt1', text: 'Human', isCorrect: false },
      { id: 'q24_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'audio',
    mediaUrl: '/media/audio6.mp3'
  },
  {
    id: 'q25',
    text: 'Who’s behind this masterpiece: AI or Human?',
    options: [
      { id: 'q25_opt1', text: 'Human', isCorrect: false },
      { id: 'q25_opt2', text: 'AI', isCorrect: true }
    ],
    mediaType: 'audio',
    mediaUrl: '/media/audio5.mp3'
  },
  {
    id: 'q26',
    text: 'This website/app was primarily made by?',
    options: [
      { id: 'q26_opt1', text: 'Human', isCorrect: true },
      { id: 'q26_opt2', text: 'AI', isCorrect: false }
    ],
    websiteLabel: 'Bruno Simon',
    websiteUrl: 'https://bruno-simon.com/'
  },
  {
    id: 'q27',
    text: 'How was this app built?',
    options: [
      { id: 'q27_opt1', text: 'Human', isCorrect: false },
      { id: 'q27_opt2', text: 'AI', isCorrect: true }
    ]
  }
];

export const Lobby: React.FC<LobbyProps> = ({ onQuizGenerated }) => {
  const shuffleQuestions = (questions: Question[]): Question[] => {
    if (questions.length <= 1) return questions;

    const fixedFirst = questions[0];
    const remaining = [...questions.slice(1)];
    const finalQuestionIndex = remaining.findIndex(q => q.id === 'q27');
    const finalQuestion = finalQuestionIndex !== -1 ? remaining.splice(finalQuestionIndex, 1)[0] : null;
    const shuffled = remaining;

    // Fisher-Yates shuffle for all questions except Q1.
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Enforce q25 before q24 ("Q24 -> Q25").
    const q24Index = shuffled.findIndex(q => q.id === 'q24');
    const q25Index = shuffled.findIndex(q => q.id === 'q25');
    if (q24Index !== -1 && q25Index !== -1 && q24Index < q25Index) {
      const [q24] = shuffled.splice(q24Index, 1);
      const newQ25Index = shuffled.findIndex(q => q.id === 'q25');
      shuffled.splice(newQ25Index + 1, 0, q24);
    }

    return finalQuestion ? [fixedFirst, ...shuffled, finalQuestion] : [fixedFirst, ...shuffled];
  };

  const handleStart = () => {
    onQuizGenerated(shuffleQuestions(STATIC_QUIZ));
  };

  return (
    <div className="quiz-shell min-h-screen bg-[#f6f0e8] flex items-center justify-center p-4 md:p-8">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[42%] h-[42%] bg-amber-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[42%] h-[42%] bg-teal-200 rounded-full blur-3xl opacity-35"></div>
      </div>

      <div className="max-w-2xl w-full glass-card hero-panel p-8 md:p-12 relative z-10 text-center space-y-8 reveal-in">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-600 to-amber-700 mb-2 shadow-xl shadow-amber-700/20">
            <Brain className="w-10 h-10 text-stone-100" />
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Live Workshop Quiz</p>
          <h1 className="text-5xl md:text-6xl display-font font-extrabold text-stone-900 hero-title">Building Superagency</h1>
          <p className="text-base md:text-lg text-stone-600">Game is on between Humans and AI</p>
        </div>

        <button
          onClick={handleStart}
          className="w-full group relative overflow-hidden btn-accent rounded-2xl py-5 font-bold text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 tracking-tight"
        >
          <div className="relative flex items-center justify-center gap-3">
            <Zap className="w-6 h-6 fill-current" />
            Launch Quiz
          </div>
        </button>
      </div>
    </div>
  );
};
