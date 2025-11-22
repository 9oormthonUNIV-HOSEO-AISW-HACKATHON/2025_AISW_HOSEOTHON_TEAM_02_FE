import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import PlayListHeader from '../components/PlayListHeader';

// 이전 페이지(MakePlayListPage)에서 넘겨줄 데이터 타입 정의
interface LocationState {
    generation?: string;
    type?: string;
    playlist?: string[];
}

const PlayListResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // location.state에서 데이터 추출 (없을 경우 기본값 설정)
    const { 
        playlist = [] 
    } = (location.state ?? {}) as LocationState;

    const nickname = JSON.parse(localStorage.getItem('nickname') || '{"nickname":"사용자"}').nickname;

    // 랜덤 플리 코드 상태
    const [playlistCode, setPlaylistCode] = useState<string>('');

    // 컴포넌트 마운트 시 랜덤 코드 생성 (예: 6자리 영문 대문자)
    useEffect(() => {
        const generateCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        };
        setPlaylistCode(generateCode());
    }, []);

    // 코드 복사 기능
    const handleCopyCode = () => {
        navigator.clipboard.writeText(playlistCode);
        alert(`플리 코드 [${playlistCode}]가 복사되었습니다!`);
    };

    return (
        <div className="flex items-center justify-center">
            {/* Main Container */}
            <div className="w-full bg-white">
                
                {/* 1. Header */}
                <Header />

                {/* 2. Title Section */}
                <PlayListHeader />

                {/* 3. Nickname Banner */}
                <section className="py-6 bg-white border-b border-gray-300 flex justify-center items-center">
                    <p className="text-xl md:text-2xl font-bold text-black">
                        <span className="text-2xl md:text-3xl font-black mr-1">{nickname}</span> 님의 제작한 플레이리스트예요!
                    </p>
                </section>

                {/* 4. Content Body (Split Layout) */}
                <section className="flex flex-col md:flex-row min-h-[400px]">
                
                    {/* Left: Playlist Code & Action */}
                    <div className="w-full md:w-[40%] flex flex-col bg-white border-b md:border-b-0 md:border-r border-gray-300">
                        
                        {/* Code Display Area */}
                        <div className="flex-grow flex flex-col justify-center items-center p-8 text-center">
                            <h3 className="text-3xl font-bold text-black mb-6 mr-60">
                                플리 코드 :
                            </h3>
                            
                            {/* Generated Code */}
                            <div 
                                onClick={handleCopyCode}
                                className="text-[#758BFD] text-5xl md:text-6xl font-black tracking-widest mb-4 cursor-pointer hover:scale-105 transition-transform flex items-center gap-2"
                                title="클릭하여 복사"
                            >
                                {playlistCode}
                            </div>

                            {/* Warning Text */}
                            <div className="text-base text-right ml-10 text-gray-600 font-medium space-y-1">
                                <p>
                                    코드는 잃어버리면 다시 <span className="text-red-500 font-bold">찾을 수 없어요</span>!
                                </p>
                                <p>
                                    꼭 <span className="text-red-500 font-bold cursor-pointer underline" onClick={handleCopyCode}>복사</span>를 해주세요
                                </p>
                            </div>
                        </div>

                        {/* Bottom Button (Exchange) */}
                        <div className="h-24 border-t border-gray-300 flex items-center justify-between px-8 hover:bg-gray-50 transition-colors cursor-pointer"
                             onClick={() => navigate('/play-list-exchange')} // 예시: 교환 페이지로 이동
                        >
                            <span className="text-xl font-bold text-black">
                                플리 추천받기
                            </span>
                            <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center">
                                <ChevronRight className="text-gray-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Final Playlist View */}
                    <div className="w-full md:w-[60%] bg-[#EBEFFF] flex flex-col">
                        {/* Empty State Handling (혹시 리스트가 없을 경우) */}
                        {playlist.length === 0 ? (
                            <div className="flex-grow flex items-center justify-center text-gray-500 font-bold">
                                선택된 노래가 없습니다.
                            </div>
                        ) : (
                            playlist.map((song, index) => (
                                <div 
                                    key={index}
                                    className="flex-1 min-h-[80px] flex items-center justify-center border-b border-gray-300 px-4 last:border-b-0"
                                >
                                    <span className="text-lg md:text-xl font-bold text-black text-center">
                                        {song}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                </section>

            </div>
        </div>
    );
};

export default PlayListResultPage;