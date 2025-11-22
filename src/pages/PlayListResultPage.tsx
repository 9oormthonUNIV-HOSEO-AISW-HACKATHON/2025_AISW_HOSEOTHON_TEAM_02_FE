import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import PlayListHeader from '../components/PlayListHeader';

interface Song {
title: string;
artist: string;
}

interface LocationState {
generation?: string;
type?: string;
playlist?: Song[];
}

const PlayListResultPage: React.FC = () => {
const location = useLocation();
const navigate = useNavigate();

const { playlist = [] } = (location.state ?? {}) as LocationState;
const nickname = JSON.parse(localStorage.getItem('nickname') || '{"nickname":"사용자"}').nickname;
const userCode = localStorage.getItem('userCode') || '';
const [playlistCode, setPlaylistCode] = useState<string>('');

useEffect(() => {
    setPlaylistCode(userCode);
}, [userCode]);

const handleCopyCode = () => {
    navigator.clipboard.writeText(playlistCode);
    alert(`플리 코드 [${playlistCode}]가 복사되었습니다!`);
};

return (
    <div className="h-screen overflow-hidden flex flex-col font-sans bg-gray-50">
        <div className="w-full bg-white shadow-xl flex flex-col flex-1 min-h-0">
            <Header />
            <PlayListHeader />

            <section className="py-6 bg-white border-b border-gray-300 flex justify-center items-center">
                <p className="text-xl md:text-2xl font-bold text-black">
                    <span className="text-2xl md:text-3xl font-black mr-1">{nickname}</span> 님의 제작한 플레이리스트예요!
                </p>
            </section>

            <section className="flex flex-col md:flex-row flex-1 min-h-0">
                <div className="w-full md:w-[40%] flex flex-col bg-white border-b md:border-b-0 md:border-r border-gray-300">
                    <div className="flex-grow flex flex-col justify-center items-center p-8 text-center">
                        <h3 className="text-3xl font-bold text-black mb-6">
                            플리 코드 :
                        </h3>
                        <div 
                            onClick={handleCopyCode}
                            className="text-[#758BFD] text-5xl md:text-6xl font-black tracking-widest mb-4 cursor-pointer hover:scale-105 transition-transform flex items-center gap-2"
                            title="클릭하여 복사"
                        >
                            {playlistCode}
                        </div>
                        <div className="text-base text-right ml-10 text-gray-600 font-medium space-y-1">
                            <p>
                                코드는 잃어버리면 다시 <span className="text-red-500 font-bold">찾을 수 없어요</span>!
                            </p>
                            <p>
                                꼭 <span className="text-red-500 font-bold cursor-pointer underline" onClick={handleCopyCode}>복사</span>를 해주세요
                            </p>
                        </div>
                    </div>

                    <div className="h-24 border-t border-gray-300 flex items-center justify-between px-8 hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => navigate('/play-list-exchange')}
                    >
                        <span className="text-xl font-bold text-black">
                            플리 추천받기
                        </span>
                        <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center">
                            <ChevronRight className="text-gray-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-[60%] bg-[#EBEFFF] flex flex-col">
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
                                    {song.artist} – {song.title}
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
