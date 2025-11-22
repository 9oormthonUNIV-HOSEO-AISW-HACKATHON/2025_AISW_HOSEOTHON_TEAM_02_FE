import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Nextbutton_Left from "../assets/img/Nextbutton_Left.svg";
import api from "../api/axios";

export default function SharePage() {
    const navigate = useNavigate();
    const userCode = localStorage.getItem("userCode") || "";
    const code = userCode || "------";

    interface Song {
        id: number;
        title: string;
        artist: string;
        generation: string;
        genre: string;
        youtubeUrl: string | null;
    }

    interface ExchangedPlaylist {
        id: number;
        songs: Song[];
    }

    const [exchangeList, setExchangeList] = useState<ExchangedPlaylist[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const fetchExchanges = async () => {
            try {
                const res = await api.get(`/api/v1/exchanges/${userCode}`);
                setExchangeList(res.data.data || []);
                console.log("조회 결과:", res.data.data);
            } catch (error) {
                console.error("플리 교환 목록 조회 실패:", error);
            }
        };

        if (userCode) fetchExchanges();
    }, [userCode]);

    const formatReviewerBlock = (song: Song) => {
        const gen = song.generation?.replace("gen", "") || "N";
        let type = "";
        if (song.genre === "EMOTIONAL") type = "감성";
        if (song.genre === "HIP") type = "힙합";
        if (song.genre === "VOCAL") type = "보컬";
        if (song.genre === "DANCE") type = "댄스";

        return (
            <>
                <span className="text-primary-300">{gen}</span>
                <span className="text-black">세대 </span>
                <span className="text-primary-300">{type}</span>
                <span className="text-black"> 유형</span>
            </>
        );
    };

    return (
        <main className="min-h-screen grid grid-rows-[auto_auto_auto_1fr] overflow-hidden">
            <Header />

            <div className="text-center py-8 border-b border-gray-300">
                <h1 className="text-nickname">주고받은 플레이리스트</h1>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-300 text-center">
                <button
                    className="col-span-1 text-heading-h4 p-6 border-gray-300 hover:bg-hover-white transition flex items-center justify-center gap-5"
                    onClick={() => navigate("/review")}
                >
                    <img src={Nextbutton_Left} alt="back" className="w-10" />
                    <span className="text-black">이전</span>
                </button>

                <div className="col-span-2 flex items-center justify-center text-primary-300 text-heading-h4 font-semibold tracking-widest">
                    {code}
                </div>
            </div>

            <div className="grid grid-cols-3 overflow-hidden">
                {/* Left - Reviewer List */}
                <div className="col-span-1 border-r border-gray-300 overflow-y-auto">
                    {exchangeList.length ? (
                        exchangeList.map((item, idx) => {
                            const firstSong = item.songs?.[0];

                            const active = selectedIndex === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`w-full px-6 py-7 border-b border-gray-300 flex justify-center ${
                                        active ? "bg-hover-white" : "bg-white"
                                    }`}
                                >
                                    <span className="text-heading-h4 font-semibold text-center">
                                        {firstSong ? formatReviewerBlock(firstSong) : "알 수 없음"}
                                    </span>
                                </button>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-center p-10">아직 교환된 플레이리스트가 없어요!</p>
                    )}
                </div>

                {/* Right - Playlist */}
                <div className="col-span-2 divide-y overflow-hidden text-center">
                    {exchangeList[selectedIndex]?.songs?.map((song: Song, idx: number) => (
                        <div
                            key={idx}
                            className="p-7 text-heading-h4 bg-primary-100 border-b border-gray-300 cursor-pointer"
                            onClick={() => song.youtubeUrl && window.open(song.youtubeUrl, "_blank")}
                        >
                            {song.artist} - {song.title}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
