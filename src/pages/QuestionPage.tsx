import React, { useState } from "react";
import { useQuestionStore } from "../store/useQuestionStore";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import QuestionHeader from "../components/QuestionHeader";

// 타입 정의
interface Option {
  text: string;
  meta?: {
    gen?: "g1" | "g2" | "g3" | "g4";
    type?: "vocal" | "dance" | "emo" | "hip";
  };
}

interface QuestionData {
  id: number;
  question: string;
  options: Option[];
}

// type 변환 매핑
const typeMap = {
  vocal: "보컬",
  dance: "댄스",
  emo: "감성",
  hip: "힙합",
} as const;

// 📌 새로운 목데이터
const questions: QuestionData[] = [
  {
    id: 1,
    question: "K-pop 하면 떠오르는 첫 장면은 무엇인가요?",
    options: [
      { text: "틱톡·릴스 챌린지로 노래 접하기", meta: { gen: "g4" } },
      { text: "CD 플레이어 + 가사집 펼쳐보기", meta: { gen: "g1" } },
      { text: "콘서트·응원법·퍼포먼스 중심 무대", meta: { gen: "g3" } },
      { text: "싸이월드 BGM + 직찍·직캠 문화", meta: { gen: "g2" } },
    ],
  },
  {
    id: 2,
    question: "약속 장소까지 30분을 걸어간다. 이때 가장 먼저 트는 노래는?",
    options: [
      { text: "EXO – 첫눈", meta: { gen: "g3", type: "vocal" } },
      { text: "HOT – Candy", meta: { gen: "g1", type: "dance" } },
      { text: "IVE – After Like", meta: { gen: "g4", type: "dance" } },
      { text: "2NE1 – I Don’t Care", meta: { gen: "g2", type: "emo" } },
    ],
  },
  {
    id: 3,
    question: "음악 들을 때 내 모습과 가장 가까운 건?",
    options: [
      { text: "고음 나오면 혼자 속으로 따라 부름", meta: { type: "vocal" } },
      { text: "걸으면서 자연스럽게 스텝 밟음", meta: { type: "dance" } },
      { text: "이어폰 꽂고 창밖 보며 감정선 따라감", meta: { type: "emo" } },
      { text: "베이스 떨어질 때 고개 끄덕이기", meta: { type: "hip" } },
    ],
  },
  {
    id: 4,
    question: "내가 가장 ‘중독’됐던 K-pop 밈은?",
    options: [
      { text: "Love Shot 허리춤 / Cheer Up 샤샤샤", meta: { gen: "g3" } },
      { text: "캔디 춤 따라하기", meta: { gen: "g1" } },
      { text: "Super Shy 챌린지 / Hype Boy 포인트", meta: { gen: "g4" } },
      { text: "Roly Poly / Gee / Sorry Sorry", meta: { gen: "g2" } },
    ],
  },
  {
    id: 5,
    question: "음악으로 힐링해야 할 때, 떠오르는 장소는?",
    options: [
      { text: "조용한 방에서 이어폰 꽂기", meta: { type: "vocal" } },
      { text: "컴퓨터 앞에서 비트 들으며 작업", meta: { type: "hip" } },
      { text: "비 오는 날 창가", meta: { type: "emo" } },
      { text: "밤거리 산책", meta: { type: "dance" } },
    ],
  },
  {
    id: 6,
    question: "‘여름’ 하면 생각나는 곡은?",
    options: [
      { text: "트와이스 – Dance The Night Away", meta: { gen: "g3" } },
      { text: "뉴진스 – Attention", meta: { gen: "g4" } },
      { text: "쿨 – 해변의 여인", meta: { gen: "g1" } },
      { text: "f(x) – Hot Summer", meta: { gen: "g2" } },
    ],
  },
  {
    id: 7,
    question: "친구가 ‘너 첫 K-pop 최애 누구였어?’라고 물어본다.",
    options: [
      { text: "BTS / EXO / TWICE", meta: { gen: "g3" } },
      { text: "NewJeans / IVE / LE SSERAFIM", meta: { gen: "g4" } },
      { text: "HOT / S.E.S / god", meta: { gen: "g1" } },
      { text: "BIGBANG / 2NE1 / 소녀시대", meta: { gen: "g2" } },
    ],
  },
  {
    id: 8,
    question: "새 앨범이 나왔을 때, 가장 먼저 보는 포인트는?",
    options: [
      { text: "메인 보컬·하모니 구성", meta: { type: "vocal" } },
      { text: "퍼포먼스·안무 영상", meta: { type: "dance" } },
      { text: "감성·추억 요소", meta: { type: "emo" } },
      { text: "랩 파트·라인 배치", meta: { type: "hip" } },
    ],
  },
  {
    id: 9,
    question: "아래 중 가장 공감되는 ‘내 세대 감성’은?",
    options: [
      { text: "미니멀리즘 + 세련된 사운드", meta: { gen: "g4" } },
      { text: "보컬 중심 레트로 감성", meta: { gen: "g1" } },
      { text: "퍼포먼스·세계관", meta: { gen: "g3" } },
      { text: "중독성 강한 후렴", meta: { gen: "g2" } },
    ],
  },
  {
    id: 10,
    question: "아래 상황 중 ‘나 같다’ 싶은 건?",
    options: [
      { text: "랩 파트 나오면 집중력 상승", meta: { type: "hip" } },
      { text: "음악 나오면 가만히 못 있음", meta: { type: "dance" } },
      { text: "고음 나오면 귀 기울임", meta: { type: "vocal" } },
      { text: "가사 한 줄에 감정 몰입", meta: { type: "emo" } },
    ],
  },
];

const QuestionPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { answers, setAnswer } = useQuestionStore();
  const navigate = useNavigate();

  const activeQuestion = questions.find((q) => q.id === currentStep)!;

  // 결과 계산
  const calculateResult = () => {
    const genScore = { g1: 0, g2: 0, g3: 0, g4: 0 };
    const typeScore = { 보컬: 0, 댄스: 0, 감성: 0, 힙합: 0 };

    questions.forEach((q) => {
      const selectedIndex = answers[q.id];
      if (selectedIndex === undefined) return;

      const opt = q.options[selectedIndex];
      if (!opt || !opt.meta) return;

      // gen
      if (opt.meta.gen) genScore[opt.meta.gen]++;

      // type
      if (opt.meta.type) {
        const translated = typeMap[opt.meta.type];
        typeScore[translated]++;
      }
    });

    const bestGen = Object.entries(genScore).sort((a, b) => b[1] - a[1])[0][0];
    const bestType = Object.entries(typeScore).sort((a, b) => b[1] - a[1])[0][0];

    return {
      resultGen:
        bestGen === "g1"
          ? "1"
          : bestGen === "g2"
          ? "2"
          : bestGen === "g3"
          ? "3"
          : "4",
      resultType: `${bestType}`,
      genScore,
      typeScore,
      answers,
    };
  };

  const handleSubmit = () => {
    const result = calculateResult();
    console.log(" 최종 결과:", result);
    navigate("/result", { 
      state: { 
        generation: result.resultGen, 
        type: result.resultType 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="w-full border-b border-black">
        <Header />

        <QuestionHeader />
      </div>

      <div className="flex mx-auto border-t border-gray-300 h-[600px]">
        {/* Left Sidebar */}
        <aside className="w-1/4 border-r border-gray-300 bg-[#E9ECFF] overflow-y-auto">
          {questions.map((q) => (
            <div
              key={q.id}
              onClick={() => setCurrentStep(q.id)}
              className={`
                p-6 border-b border-gray-300 cursor-pointer transition-colors relative
                ${
                  q.id === currentStep
                    ? "bg-[#D6D9EA]"
                    : "hover:bg-[#D6D9EA]"
                }
              `}
            >
              {answers[q.id] !== undefined && (
                <div className="absolute top-2 right-2 text-blue-500 text-xs">
                  ✔
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{q.id}번 질문</h3>
              <p className="text-gray-600 text-sm truncate leading-relaxed">
                {q.question}
              </p>
            </div>
          ))}
        </aside>

        {/* Right Content */}
        <main className="w-3/4 p-10 flex flex-col relative">
            <div className="mb-12">
                <div className="flex items-start gap-3">
                    <span className="text-2xl font-extrabold text-black">
                    질문 {activeQuestion.id}.
                    </span>

                    <h2 className="text-2xl font-bold leading-normal">
                    {activeQuestion.question}
                    </h2>
                </div>
            </div>

          <div className="w-full border border-gray-400 divide-y divide-gray-400">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = answers[activeQuestion.id] === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setAnswer(activeQuestion.id, idx)}
                  className={`
                    cursor-pointer  w-full py-5 text-lg font-bold text-center hover:bg-[#E9ECFF] transition-colors
                    ${
                      isSelected
                        ? "bg-[#E9ECFF] text-blue-600"
                        : "bg-white"
                    }
                  `}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-auto flex justify-between items-end pt-10">
            {currentStep > 1 ? (
              <div 
                className="group flex items-center gap-4 cursor-pointer"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <div className="text-gray-500 font-medium text-lg leading-tight group-hover:text-black text-right">
                  이<br />전
                </div>

                <button className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center bg-white group-hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 text-gray-500 group-hover:text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              </div>
            ) : (
              <div></div>
            )}

            {currentStep < questions.length ? (
              <div 
                className="group flex items-center gap-4 cursor-pointer"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                <div className="cursor-pointer text-gray-500 font-medium text-lg leading-tight group-hover:text-black text-right">
                  다<br />음
                </div>

                <button className="cursor-pointer w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center bg-white group-hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 text-gray-500 group-hover:text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            ) : (
              <div 
                className="group flex items-center gap-4 cursor-pointer"
                onClick={handleSubmit}
              >
                <div className="cursor-pointer text-blue-600 font-bold text-lg leading-tight text-right">
                  완<br />료
                </div>
                
                <button className="cursor-pointer w-12 h-12 rounded-full border border-blue-600 flex items-center justify-center bg-white group-hover:bg-blue-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default QuestionPage;
