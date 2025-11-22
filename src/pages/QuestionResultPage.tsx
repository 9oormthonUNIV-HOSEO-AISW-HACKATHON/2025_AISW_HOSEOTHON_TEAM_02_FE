import React from 'react';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { kpopData } from "../data/kpopData";
import QuestionHeader from '../components/QuestionHeader';

interface LocationState {
    generation?: string;
    type?: string;
}

type GenKeys = "1" | "2" | "3" | "4";
type TypeKeys = "감성" | "댄스" | "힙합" | "보컬";

const QuestionResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { generation = '', type = '' } = (location.state ?? {}) as LocationState;

    // 사용 예시
    function getArtists(gen: GenKeys) {
        return kpopData[gen].artists;
    }

    function getSongs(type: TypeKeys) {
        const songs = kpopData[type]; // type에 맞는 모든 곡을 그대로 반환
        console.log(songs);
        return songs;
    }

    const onClickMakePlaylistButton = () => {
      navigate('/make-playlist', { state: { generation, type } });
    }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full border-b border-black">
        
        {/* 1. Top Bar (Logo) */}
        <Header />

        {/* 2. Question Header */}
        <QuestionHeader />

        {/* 3. Main Result Section */}
        <section className="flex border-b border-gray-300 h-[400px]">
          {/* Left: Result Text */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-center bg-white">
            <div className="space-y-2">
              <p className="text-3xl text-nickname text-black">
                당신은 <span className="text-heading-h2 ">K-POP</span>{' '}
                <span className="text-[#758BFD] text-heading-h2">{generation}</span>
                <span className="text-heading-h2 font-bold">세대</span>
              </p>
              
              <div className="flex items-end justify-center gap-2 mt-4">
                <span className="text-[#758BFD] text-heading-h2 ">
                    {type}
                </span>
                <span className="text-heading-h2 text-black">
                  유형
                </span>
                <span className="text-body-big font-bold text-black ml-48 mb-4">이에요!</span>
              </div>
            </div>
          </div>

          {/* Right: Action Button (Playlist) */}
          <button className="w-[190px] bg-[#EBEFFF] border-l border-gray-300 flex flex-col justify-center items-center hover:bg-[#dde2ff] transition-colors cursor-pointer group"
            onClick={onClickMakePlaylistButton}>
            <span className="text-body-big font-bold text-gray-800 mb-4 leading-tight text-center px-2">
              플리<br />제작<br />하기
            </span>
            <div className="w-[71px] h-[71px] rounded-full border border-gray-400 flex items-center justify-center group-hover:border-gray-600 transition-colors">
              <ChevronRight className="text-gray-500 group-hover:text-gray-700" size={35} />
            </div>
          </button>
        </section>

        {/* 4. Footer Details (Grid) */}
        <section className="grid grid-cols-2 h-[224px] bg-[#EBEFFF]">

          {/* Left Col: Artists */}
          <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-300">
            <h3 className="text-body-big font-bold text-black mb-4">
              K-POP {generation}세대 아티스트
            </h3>
            <p className="text-black text-heading-h4 font-medium">
              {getArtists(generation as GenKeys).join(" / ")}
            </p>
          </div>

          {/* Right Col: Songs */}
          <div className="p-8 text-center">
            <h3 className="text-body-big font-bold text-black mb-4">
              {type} 유형의 주 노래
            </h3>
            <div className="text-black font-medium text-heading-h4">
                {(() => {
                    const songs = getSongs(type as TypeKeys);
                    const rows = [];
                    for (let i = 0; i < songs.length; i += 2) {
                    const pair = songs.slice(i, i + 2); // 2개씩 자르기
                    rows.push(
                        <p key={i}>
                        {pair.map((song) => `${song.artist} – ${song.title}`).join(" / ")}
                        </p>
                    );
                    }
                    return rows;
                })()}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default QuestionResultPage;