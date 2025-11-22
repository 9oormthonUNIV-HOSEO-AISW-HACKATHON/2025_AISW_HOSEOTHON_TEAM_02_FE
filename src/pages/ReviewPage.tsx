import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api/axios.ts";

export default function ReviewPage() {

    interface Song {
        title: string;
        artist: string;
    }

    interface Review {
        reviewId: number;
        content: string;
        createdAt: string;
    }

    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);


    const [code, setCode] = useState("");
    const [generationLabel, setGenerationLabel] = useState("");
    const [typeLabel, setTypeLabel] = useState("");

    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    const genMap: Record<string, string> = {
        gen1: "1세대",
        gen2: "2세대",
        gen3: "3세대",
        gen4: "4세대",
    };

    const genreMap: Record<string, string> = {
        emo: "감성",
        hip: "힙합",
        vocal: "보컬",
        dance: "댄스",
    };

    const handleButtonClick = async () => {
        if (!isValid) {
            if (code.trim().length === 6) {
                try {
                    const storedUserCode = localStorage.getItem("userCode") || '';
                    const playListId = localStorage.getItem("playListId") || '';
                    if (!storedUserCode) {
                        alert("사용자 코드가 저장되어 있지 않습니다!");
                        return;
                    }

                    const reviewRes = await api.get(`/api/v1/reviews/${code.trim()}`);
                    const playlistRes = await api.get(`/api/v1/playlists/${playListId}`);

                    const playlistData = playlistRes.data.data.songs || [];
                    const reviewData = reviewRes.data.data || {};

                    setPlaylist(playlistData);
                    setReviews(reviewData.reviews || []);

                    setGenerationLabel(genMap[reviewData.generation]);
                    setTypeLabel(genreMap[reviewData.favoriteGenre]);

                    setIsValid(true);
                } catch (error) {
                    alert("존재하지 않는 코드입니다!");
                    console.error(error);
                }
            } else {
                alert("6자리 코드를 입력해주세요!");
            }
        } else {
            navigate("/share", { state: { code } });
        }
    };


    return (
        <main className="h-screen grid grid-rows-[auto_auto_auto_1fr] overflow-hidden">
            <Header />

            <div className="text-center py-8 border-b border-gray-300">
                <h1 className="text-nickname">노래 감상평 확인하기</h1>
            </div>

            <div className="grid grid-cols-3 border-y border-gray-300 text-center">
                <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`col-span-2 p-6 text-heading-h4 border-r border-gray-300 text-center tracking-wide ${
                        isValid ? "text-primary-300" : "text-black"
                    }`}
                    placeholder="000000"
                />
                <button
                    className="col-span-1 text-heading-h4 p-6 hover:bg-hover-100 transition"
                    onClick={handleButtonClick}
                >
                    {isValid ? "주고받은 플리 확인하기" : "확인"}
                </button>
            </div>

            {isValid && (
                <div className="grid grid-cols-3 overflow-hidden">

                    {/* Playlist */}
                    <div className="col-span-2 divide-y border-gray-300 overflow-hidden text-center">
                        {playlist.map((song, idx) => (
                            <div key={idx} className="p-7 text-heading-h4 bg-primary-100 border-gray-300">
                                {song.title} - {song.artist}
                            </div>
                        ))}
                    </div>

                    {/* Reviews */}
                    <div className="col-span-1 p-6 overflow-y-auto space-y-4">
                        {reviews.map((item) => (
                            <div key={item.reviewId} className="border border-gray-300 rounded-lg p-4 bg-white">
                                <p className="text-heading-h4 font-semibold">
                                    <span className="text-primary-300">{generationLabel}</span>{" "}
                                    <span className="text-primary-300">{typeLabel}</span> 유형
                                </p>
                                <p className="text-regular-16 mt-2 text-black">
                                    {item.content}
                                </p>
                            </div>
                        ))}

                        {reviews.length === 0 && (
                            <p className="text-gray-400 text-center mt-10">아직 작성된 감상평이 없습니다.</p>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
