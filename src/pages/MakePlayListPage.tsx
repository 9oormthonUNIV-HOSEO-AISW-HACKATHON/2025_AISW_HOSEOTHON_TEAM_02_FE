import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import PlayListHeader from '../components/PlayListHeader';
import Nextbutton_Right from "../assets/img/Nextbutton_Right.svg";
import api from '../api/axios';

interface LocationState {
generation?: string;
type?: string;
}

interface Song {
    id?: number;
    title: string;
    artist: string;
}

const SERVER_SONG_DATABASE: Song[] = [
{ title: "FANTASTIC BABY", artist: "빅뱅" },
{ title: "NALINA", artist: "BLOCK B" },
{ title: "우산", artist: "에픽하이" },
{ title: "WHERE U AT", artist: "태양" },
{ title: "VERY GOOD", artist: "블락비" },
{ title: "Gee", artist: "소녀시대" },
{ title: "I Don't Care", artist: "2NE1" },
{ title: "Sherlock", artist: "샤이니" },
{ title: "Fiction", artist: "비스트" },
{ title: "내꺼하자", artist: "인피니트" },
{ title: "으르렁", artist: "EXO" },
{ title: "DNA", artist: "방탄소년단" },
{ title: "좋은날", artist: "아이유" },
{ title: "Tell Me", artist: "원더걸스" },
{ title: "미스터", artist: "카라" }
];

const MakePlayListPage: React.FC = () => {
const [nickname, setNickname] = useState('');
const location = useLocation();
const { generation = '', type = '' } = (location.state ?? {}) as LocationState;
const navigate = useNavigate();
const server_generation = "gen" + generation;

const reverseTypeMap = {
    보컬: "vocal",
    댄스: "dance",
    감성: "emo",
    힙합: "hip"
} as const;
const server_type = reverseTypeMap[type as keyof typeof reverseTypeMap] || "";

const [songsFromServer, setSongsFromServer] = useState<Song[]>([]);
const [playlist, setPlaylist] = useState<Song[]>([]);
const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

// 서버에서 노래 가져오기
useEffect(() => {
    const fetchSongs = async () => {
        try {
            const res = await api.get("/api/v1/songs/candidates", {
                params: { generation: server_generation, genre: server_type }
            });

            const songList: Song[] = res.data.data.map((song: any) => ({
                id: song.id,
                title: song.title,
                artist: song.artist
            }));
            console.log("서버에서 가져온 노래 목록:", songList);

            setSongsFromServer(songList);

            // playlist 초기화: 랜덤 5곡
            const shuffled = [...songList].sort(() => Math.random() - 0.5);
            setPlaylist(shuffled.slice(0, 5));
        } catch (error) {
            console.error("노래 불러오기 실패:", error);
        }
    };

    fetchSongs();
}, [server_generation, server_type]);

console.log("서버에서 가져온 노래:", playlist);

const handleSongChange = (index: number, newSong: Song) => {
    const newPlaylist = [...playlist];
    newPlaylist[index] = newSong;
    setPlaylist(newPlaylist);
    setOpenDropdownIndex(null);
};

const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
};

const sendResultMusic = async() => {
    const hasDuplicate = new Set(playlist.map(p => p.title + p.artist)).size !== playlist.length;

    if (nickname.trim() === '') {
        alert('닉네임을 입력해주세요.');
        return;
    } else if (nickname.length > 6) {
        alert('닉네임은 최대 6자까지 가능합니다.');
        setNickname('');
        return;
    }

    if (hasDuplicate) {
        alert("중복된 노래가 있어요! 모두 다른 노래로 선택해주세요.");
        return;
    }

    localStorage.setItem('nickname', JSON.stringify({ nickname }));
    try {
        // 노래 id 배열 만들기
        const songIds = playlist.map(song => song.id).filter((id): id is number => !!id);

        const res = await api.post('/api/v1/playlists/register', {
            nickname,
            generation: server_generation,
            favoriteGenre: server_type.toUpperCase(),
            playlistTitle: `${nickname}의 플레이리스트`,
            songIds
        });

        const { userCode, playlistId } = res.data.data;
        // localStorage에 userCode 저장
        localStorage.setItem('userCode', userCode);
        localStorage.setItem('playListId', playlistId);

        // 다음 페이지로 이동할 때 state에 담기
        navigate('/play-list-complete', {
            state: { generation, type, playlist, userCode, playlistId }
        });
        } catch (error) {
        console.error("플레이리스트 등록 실패:", error);
        alert("플레이리스트 등록 중 오류가 발생했습니다.");
    }
};

const songOptions = songsFromServer.length > 0 ? songsFromServer : SERVER_SONG_DATABASE;

return (
    <div className="h-screen overflow-hidden font-sans bg-gray-50 flex flex-col">
        <div className="w-full bg-white flex flex-col flex-1 min-h-0">
            <Header />
            <PlayListHeader />
            <section className="flex flex-col md:flex-row flex-1 min-h-0">

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

                <div className="w-full md:w-[60%] flex flex-col bg-white z-10">
                    <div className="flex-1 relative min-h-0">
                        {playlist.map((song, index) => {
                            const isOpen = openDropdownIndex === index;
                            const openUp = index >= playlist.length - 2;

                            return (
                                <div key={index} className={`relative h-20 border-b border-gray-300 ${isOpen ? 'z-30' : 'z-20'}`}>
                                    <button
                                        onClick={() => toggleDropdown(index)}
                                        className={`w-full h-full flex items-center justify-between px-6 transition-colors outline-none cursor-pointer
                                        ${isOpen ? 'bg-white' : 'bg-[#EBEFFF] hover:bg-[#dfe5ff]'}`}
                                    >
                                        <span className="w-6"></span>
                                        <span className={`text-body-base font-bold md:text-xl text-center truncate mx-4
                                        ${isOpen ? 'text-[#758BFD]' : 'text-black'}`}>
                                            {song.artist} – {song.title}
                                        </span>
                                        <ChevronDown
                                            className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#758BFD]' : ''}`}
                                            size={24}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className={`
                                            absolute left-[-1px] right-[-1px] max-h-80 overflow-y-auto 
                                            bg-white border-2 border-[#758BFD] shadow-2xl rounded-b-lg z-50 scrollbar-hide
                                            ${openUp ? 'bottom-[calc(100%+1px)] rounded-t-lg rounded-b-none' : 'top-[calc(100%+1px)] rounded-b-lg'}
                                        `}>
                                            {songOptions.map((optionSong) => {
                                                const isSelected = song.title === optionSong.title && song.artist === optionSong.artist;
                                                return (
                                                    <div
                                                        key={optionSong.artist + optionSong.title}
                                                        onClick={() => handleSongChange(index, optionSong)}
                                                        className={`px-6 py-4 text-lg font-medium cursor-pointer transition-colors text-center
                                                            ${isSelected
                                                                ? 'bg-[#EBEFFF] text-[#758BFD] font-bold'
                                                                : 'text-gray-800 hover:bg-gray-100 hover:text-[#758BFD]'
                                                            }`}
                                                    >
                                                        {optionSong.artist} – {optionSong.title}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div
                        onClick={sendResultMusic}
                        className="h-[170px] flex items-center justify-end px-6 gap-3 cursor-pointer bg-white hover:bg-hover-white transition-colors">
                        <span className="text-body-big text-black">
                            플리 완성
                        </span>
                        <img src={Nextbutton_Right} alt="next" className="w-10"/>
                    </div>
                </div>

            </section>
        </div>
    </div>
);
};

export default MakePlayListPage;
