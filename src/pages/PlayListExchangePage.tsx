import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import PlayListHeader from '../components/PlayListHeader';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Song {
id: number;
title: string;
artist: string;
generation: string;
genre: string;
youtubeUrl: string | null;
}

interface RecommendationData {
targetUserCode: string;
songs: Song[];
}

const PlayListExchangePage: React.FC = () => {
const navigate = useNavigate();
const nickname = JSON.parse(localStorage.getItem('nickname') || '{"nickname":"사용자"}').nickname;
const userCode = localStorage.getItem('userCode') || '';
const [targetUserCode, setTargetUserCode] = useState<string>('');

const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
const [review, setReview] = useState('');

 
const genreMap = {
    VOCAL: "보컬",
    DANCE: "댄스",
    EMOTIONAL: "감성",
    HIP: "힙합"
} as const;

useEffect(() => {
    const fetchRecommendation = async () => {
        try {
            const res = await api.get('/api/v1/users/recommendations', {
                params: { userCode }
            });
            setRecommendation(res.data.data);
            console.log('추천 데이터:', res.data);
            setTargetUserCode(res.data.data.targetUserCode);
        } catch (error) {
            console.error('추천 데이터 가져오기 실패:', error);
        }
    };

    if (userCode) fetchRecommendation();
}, [userCode]);

const handleSave = async () => {
    if (!review) {
        alert("감상평을 입력해주세요!");
        return;
    }

    try {
        await api.post('/api/v1/reviews', {
            writerUserCode: userCode,          // 내 코드
            targetUserCode: targetUserCode,    // 상대방 코드
            content: review                     // 작성한 감상평
        });

        alert("감상평이 저장되었습니다!");
        navigate(-1);
    } catch (error) {
        console.error("감상평 저장 실패:", error);
        alert("감상평 저장에 실패했습니다. 다시 시도해주세요.");
    }
};

return (
    <div className="h-screen overflow-hidden flex flex-col font-sans bg-gray-50">
        <div className="w-full bg-white shadow-xl border border-gray-200 flex flex-col flex-1 min-h-0">
            <Header />
            <PlayListHeader />

            <section className="py-6 bg-white border-b border-gray-300 flex justify-center items-center text-center px-4">
                <p className="text-xl md:text-2xl font-bold text-black">
                    <span className="font-black text-2xl md:text-3xl border-black pb-1 mb-1 inline-block">
                        {nickname}
                    </span> 
                    님과 취향이 비슷한 플리를 추천했어요!
                </p>
            </section>

            <section className="flex flex-col md:flex-row flex-1 min-h-0">
                {/* Left: Playlist View */}
                <div className="w-full md:w-[60%] bg-[#EBEFFF] flex flex-col border-b md:border-b-0 md:border-r border-gray-300 overflow-y-auto">
                    {recommendation?.songs.map((song) => (
                        <div 
                            key={song.id}
                            className="flex-1 flex items-center justify-center border-b border-gray-300 px-4 last:border-b-0 cursor-pointer hover:bg-gray-200 transition-colors"
                            onClick={() => {
                                if (song.youtubeUrl) window.open(song.youtubeUrl, '_blank');
                            }}
                        >
                            <span className="text-xl md:text-2xl font-bold text-black text-center tracking-wide">
                                {song.artist} – {song.title}
                            </span>
                        </div>
                    )) || (
                        <div className="flex-grow flex items-center justify-center text-gray-500 font-bold">
                            추천 데이터를 불러오는 중입니다...
                        </div>
                    )}
                </div>

                {/* Right: Info & Review */}
                <div className="w-full md:w-[40%] bg-white flex flex-col justify-between">
                    <div className="p-10 flex flex-col items-end w-full">
                        <div className="mb-10 text-center w-full">
                            <h3 className="text-3xl font-bold text-black mb-1">
                                <span className="text-[#758BFD]">
                                    {recommendation?.songs[0]?.generation.replace('gen', '') || 'N'}
                                </span>
                                세대
                                <span className="text-[#758BFD]">
                                    &nbsp;{recommendation ? genreMap[recommendation.songs[0].genre as keyof typeof genreMap] : ''}&nbsp;
                                </span>
                                유형 사용자가 제작했어요
                            </h3>
                        </div>

                        <div className="w-full h-32 md:h-40 border border-gray-400 p-4 flex items-center justify-center">
                            <textarea
                                className="w-full h-full text-center text-body-base text-gray-600 focus:outline-none resize-none placeholder-gray-500 pt-10"
                                placeholder="감상평을 작성해주세요!"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>
                    </div>

                    <div 
                        className="group h-20 border-t border-gray-300 flex items-center justify-end px-8 gap-4 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={handleSave}
                    >
                        <span className="text-2xl font-bold text-black">
                            저장하기
                        </span>
                        <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center 
                                        group-hover:border-gray-600 transition-colors">
                            <ChevronRight 
                                className="text-gray-600 group-hover:text-gray-800 transition-colors" 
                                size={24} 
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
);

};

export default PlayListExchangePage;
