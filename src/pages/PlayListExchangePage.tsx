import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header'; // 기존 헤더 컴포넌트 재사용 가정
import { useNavigate } from 'react-router-dom';
import PlayListHeader from '../components/PlayListHeader';

const PlayListExchangePage: React.FC = () => {
    const navigate = useNavigate();
    const [review, setReview] = useState('');
    const nickname = JSON.parse(localStorage.getItem('nickname') || '{"nickname":"사용자"}').nickname;


    // 임시 데이터 (이미지 텍스트 반영)
    const exchangeData = {
        targetNickname: "케이팝고인물",
        myGeneration: "2",
        myType: "힙합",
        targetGeneration: "N", // 교환받은 상대방의 세대
        targetType: "힙합",    // 교환받은 상대방의 유형
        playlist: [
        "어쩌구",
        "저쩌구",
        "000000000000",
        "000000000000",
        "000000000000"
        ]
    };

    const handleSave = () => {
        console.log("저장된 감상평:", review);
        navigate(-1);
        // 저장 로직 수행 후 이동
        alert("저장이 완료되었습니다!");
    };

    return (
        <div className="h-full flex items-center justify-center bg-gray-50">
            {/* Main Container */}
            <div className="w-full bg-white shadow-xl border border-gray-200">
                
                {/* 1. Header */}
                <Header />

                {/* 2. Title Section */}
                <PlayListHeader />

                {/* 3. Banner Section */}
                <section className="py-6 bg-white border-b border-gray-300 flex justify-center items-center text-center px-4">
                    <p className="text-xl md:text-2xl font-bold text-black">
                        <span className="font-black text-2xl md:text-3xl border-black pb-1 mb-1 inline-block">
                            {nickname}
                        </span> 
                        님과 취향이 비슷한 플리를 교환했어요!
                    </p>
                </section>

                {/* 4. Content Body (Split Layout) */}
                <section className="flex flex-col md:flex-row ">
                
                {/* Left: Playlist View (Background Color) */}
                <div className="w-full md:w-[60%] bg-[#EBEFFF] flex flex-col border-b md:border-b-0 md:border-r border-gray-300">
                    {exchangeData.playlist.map((song, index) => (
                    <div 
                        key={index}
                        className="flex-1 flex items-center justify-center border-b border-gray-300 px-4 last:border-b-0"
                    >
                        <span className="text-xl md:text-2xl font-bold text-black text-center tracking-wide">
                        {song}
                        </span>
                    </div>
                    ))}
                </div>

                {/* Right: Info & Input Form */}
                <div className="w-full md:w-[40%] bg-white flex flex-col justify-between">
                    
                    {/* Top: Exchange Info & Input */}
                    <div className="p-8 flex flex-col items-end w-full">
                        {/* Target Type Info */}
                        <div className="mb-8 text-center w-full">
                            <h3 className="text-3xl font-bold text-black mb-1 ">
                                <span className="text-[#758BFD]">{exchangeData.targetGeneration}</span>세대 <span className="text-[#758BFD]">{exchangeData.targetType}</span> 유형 사용자가 제작했어요
                            </h3>
                        </div>

                        {/* Review Input Box */}
                        <div className="w-full h-32 md:h-40 border border-gray-400 p-4 flex items-center justify-center">
                            <textarea
                                className="w-full h-full text-center text-body-base text-gray-600 focus:outline-none resize-none placeholder-gray-500 pt-10" // pt-10으로 플레이스홀더 수직 중앙 정렬 느낌
                                placeholder="감상평을 작성해주세요!"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Bottom: Save Button */}
                    <div className="h-16 my-4 border-t border-gray-300 flex items-center justify-end px-8 gap-4 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={handleSave}
                    >
                        <span className="text-2xl font-bold text-black">
                            저장하기
                        </span>
                        <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center group-hover:border-gray-600">
                            <ChevronRight className="text-gray-600" size={24} />
                        </div>
                    </div>

                </div>

                </section>

            </div>
        </div>
    );
};

export default PlayListExchangePage;