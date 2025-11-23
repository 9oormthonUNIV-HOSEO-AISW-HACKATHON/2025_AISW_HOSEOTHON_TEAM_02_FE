import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api/axios";

export default function ReviewPage() {

    interface Song {
        title: string;
        artist: string;
    }

    interface Review {
        reviewId: number;
        writerNickname: string;
        writerGeneration: string;
        writerFavoriteGenre: string;
        content: string;
        createdAt: string;
    }

    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const [code, setCode] = useState("");
    const [isValid, setIsValid] = useState(false);

    const navigate = useNavigate();

    const genMap: Record<string, string> = {
        gen1: "1",
        gen2: "2",
        gen3: "3",
        gen4: "4",
    };

    const genreMap: Record<string, string> = {
        eom: "감성",
        hip: "힙합",
        vocal: "보컬",
        dance: "댄스",
    };

    const handleButtonClick = async () => {
        if (!isValid) {
            if (code.trim().length !== 6) {
                alert("6자리 코드를 입력해주세요!");
                return;
            }

            try {
                const playListId = localStorage.getItem("playListId") || "";
                if (!playListId) {
                    alert("플레이리스트 정보가 없습니다!");
                    return;
                }

                const reviewRes = await api.get(`/api/v1/reviews/${code.trim()}`);
                const playlistRes = await api.get(`/api/v1/playlists/${playListId}`);

                const playlistData = playlistRes.data.data?.songs || [];
                const reviewData = reviewRes.data.data?.reviews || [];

                setPlaylist(playlistData);
                setReviews(reviewData);

                setIsValid(true);

            } catch (error) {
                alert("존재하지 않는 코드입니다!");
                console.error(error);
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
                                <p className="text-heading-h4 font-semibold text-black">
                                    <span className="text-primary-300">
                                        {genMap[item.writerGeneration] ?? "?"}
                                    </span>
                                    <span className="text-black">세대 </span>
                                    <span className="text-primary-300">
                                        {genreMap[item.writerFavoriteGenre] ?? ""}
                                    </span>
                                    <span className="text-black"> 유형</span>
                                </p>
                                <p className="text-regular-16 mt-2 text-black">
                                    {item.content}
                                </p>
                            </div>
                        ))}

                        {reviews.length === 0 && (
                            <p className="text-gray-400 text-center mt-10">
                                아직 작성된 감상평이 없습니다.
                            </p>
                        )}
                    </div>

                </div>
            )}
        </main>
    );
}
