import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react'; // ChevronDown 추가
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import PlayListHeader from '../components/PlayListHeader';

interface LocationState {
    generation?: string;
    type?: string;
}

// 나중에 서버에서 가져올 전체 노래 데이터 (예시)
const SERVER_SONG_DATABASE = [
    "빅뱅 – FANTASTIC BABY",
    "BLOCK B - NALINA",
    "에픽하이 - 우산",
    "태양 - WHERE U AT",
    "블락비 - VERY GOOD",
    "소녀시대 - Gee",
    "2NE1 - I Don't Care",
    "샤이니 - Sherlock",
    "비스트 - Fiction",
    "인피니트 - 내꺼하자",
    "EXO - 으르렁",
    "방탄소년단 - DNA",
    "아이유 - 좋은날",
    "원더걸스 - Tell Me",
    "카라 - 미스터"
];

const MakePlayListPage: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const location = useLocation();
    const { generation = '', type = '' } = (location.state ?? {}) as LocationState;
    const navigate = useNavigate();

    // 화면에 보여줄 5개의 노래 리스트 상태
    const [playlist, setPlaylist] = useState<string[]>([]);

    // 현재 열려있는 드롭다운의 인덱스를 저장 (null이면 모두 닫힘)
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

    // 컴포넌트 마운트 시 랜덤으로 5곡 뽑기
    useEffect(() => {
        const shuffled = [...SERVER_SONG_DATABASE].sort(() => 0.5 - Math.random());
        setPlaylist(shuffled.slice(0, 5));
    }, []);

    // 특정 인덱스의 노래 변경 핸들러
    const handleSongChange = (index: number, newSong: string) => {
        const newPlaylist = [...playlist];
        newPlaylist[index] = newSong;
        setPlaylist(newPlaylist);
        setOpenDropdownIndex(null); // 선택 후 드롭다운 닫기
    };

    // 드롭다운 토글 핸들러
    const toggleDropdown = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    const sendResultMusic = () => {
        const hasDuplicate = new Set(playlist).size !== playlist.length;
        if (nickname.trim() === '') {
            alert('닉네임을 입력해주세요.');
            return;
        }

        if (hasDuplicate) {
            alert("중복된 노래가 있어요! 모두 다른 노래로 선택해주세요.");
            return;
        }
        localStorage.setItem('nickname', JSON.stringify({
            nickname : nickname
        }));
        navigate('/play-list-complete', { state: { generation, type, playlist } });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {/* Main Container */}
            <div className="w-full bg-white ">
                
                {/* 1. Header (Logo) */}
                <Header />

                {/* 2. Title Section */}
                <PlayListHeader />

                {/* 3. Content Body (Split Layout) */}
                <section className="flex flex-col md:flex-row min-h-[400px]">
                
                    {/* Left: Nickname Input */}
                    <div className="w-full md:w-[40%] p-8 flex flex-col justify-center items-start border-b md:border-b-0 md:border-r border-gray-300 bg-white z-0">
                        <label className="text-body-big font-bold text-black mb-4 pl-1">
                            내 닉네임은 :
                        </label>
                        
                        <div className="w-full">
                            <input 
                                type="text" 
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full h-24 border text-body-base border-gray-400 px-4 text-center text-xl focus:outline-none focus:border-[#758BFD] focus:ring-1 focus:ring-[#758BFD] transition-colors rounded-sm"
                                placeholder="닉네임을 입력하세요" 
                            />
                            <p className="text-right text-body-big font-bold text-black mt-3">
                                입니다.
                            </p>
                        </div>
                    </div>

                    {/* Right: Playlist Items */}
                    <div className="w-full md:w-[60%] flex flex-col bg-white z-10">
                        {/* List Items */}
                        <div className="flex-grow relative">
                            {playlist.map((song, index) => {
                                const isOpen = openDropdownIndex === index;
                                const openUp = index >= playlist.length - 2; // 마지막 2개는 위로 열기

                                return (
                                    <div 
                                        key={index}
                                        // z-index 관리: 열린 드롭다운이 다른 요소 위에 오도록 설정
                                        className={`relative h-20 border-b border-gray-300 ${isOpen ? 'z-30' : 'z-20'}`}
                                    >
                                        {/* --- 커스텀 드롭다운 트리거 버튼 --- */}
                                        <button
                                            onClick={() => toggleDropdown(index)}
                                            className={`w-full h-full flex items-center justify-between px-6 transition-colors outline-none cursor-pointer
                                                ${isOpen ? 'bg-white' : 'bg-[#EBEFFF] hover:bg-[#dfe5ff]'}`}
                                        >
                                            {/* 중앙 정렬을 위한 빈 공간 */}
                                            <span className="w-6"></span> 
                                            
                                            {/* 선택된 노래 제목 */}
                                            <span className={`text-lg md:text-xl font-bold text-center truncate mx-4
                                                ${isOpen ? 'text-[#758BFD]' : 'text-black'}`}>
                                                {song}
                                            </span>
                                            
                                            {/* 드롭다운 화살표 아이콘 */}
                                            <ChevronDown 
                                                className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#758BFD]' : ''}`} 
                                                size={24} 
                                            />
                                        </button>

                                        {/* --- 커스텀 드롭다운 메뉴 리스트 --- */}
                                        {isOpen && (
                                            <div
                                                className={`
                                                    absolute left-[-1px] right-[-1px] max-h-80 overflow-y-auto 
                                                    bg-white border-2 border-[#758BFD] shadow-2xl rounded-b-lg z-50 scrollbar-hide
                                                    ${openUp ? 'bottom-[calc(100%+1px)] rounded-t-lg rounded-b-none' : 'top-[calc(100%+1px)] rounded-b-lg'}
                                                `}
                                            >

                                                {SERVER_SONG_DATABASE.map((optionSong) => {
                                                    const isSelected = song === optionSong;
                                                    return (
                                                        <div 
                                                            key={optionSong} 
                                                            onClick={() => handleSongChange(index, optionSong)}
                                                            className={`px-6 py-4 text-lg font-medium cursor-pointer transition-colors text-center
                                                                ${isSelected 
                                                                    ? 'bg-[#EBEFFF] text-[#758BFD] font-bold' 
                                                                    : 'text-gray-800 hover:bg-gray-100 hover:text-[#758BFD]'
                                                                }`}
                                                        >
                                                            {optionSong}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom Action Area */}
                        <div className="h-24 bg-white flex items-center justify-end px-8 gap-4 border-t border-gray-200 z-20 relative">
                            <span className="text-xl font-bold text-black">
                                플리 완성
                            </span>
                            <button onClick={sendResultMusic}
                                    className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center hover:bg-[#EBEFFF] hover:border-[#758BFD] transition-all cursor-pointer group">
                                <ChevronRight className="text-gray-600 group-hover:text-[#758BFD]" size={24} />
                            </button>
                        </div>
                    </div>

                </section>

            </div>
        </div>
    );
};

export default MakePlayListPage;