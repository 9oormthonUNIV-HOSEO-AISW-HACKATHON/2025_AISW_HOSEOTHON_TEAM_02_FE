import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function ReviewPage() {
    const [code, setCode] = useState("");
    const [isValid, setIsValid] = useState(false);

    const navigate = useNavigate();

    const mockPlaylist = [
        "빅뱅 – FANTASTIC BABY",
        "2NE1 - I DON’T CARE",
        "에픽하이 - 우산",
        "태양 - WHERE U AT",
        "블락비 - VERY GOOD",
    ];

    const mockReviews = [
        { type: "4세대 힙합 유형", review: "이 노래가 00가수 원조인지 처음 알았어요" },
        { type: "1세대 힙합 유형", review: "잘듣고갑니다~^^" },
        { type: "4세대 힙합 유형", review: "엄빠랑 얘기하다가 밤샜어요ㅋㅋ" },
        { type: "3세대 힙합 유형", review: "완-존 내취향" },
        { type: "3세대 힙합 유형", review: "신나서 바로 뛰었음ㅋㅋ" },
    ];

    const handleButtonClick = () => {
        if (!isValid) {
            if (code.trim().length === 6) {
                setIsValid(true);
            } else {
                alert("6자리 코드를 입력해주세요!");
            }
        } else {
            navigate("/share");
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
                    className={`
                        col-span-2 p-6 text-heading-h4 border-r border-gray-300
                        text-center tracking-wide
                        ${isValid ? "text-primary-300" : "text-black"}
                    `}
                    placeholder="000000"
                />
                <button
                    className="col-span-1 text-heading-h4 p-6 hover:bg-hover-100 transition"
                    onClick={handleButtonClick}
                >
                    {isValid ? "주고받은 플리 확인하기" : "확인"}
                </button>
            </div>

            {/* 플레이리스트 & 리뷰 */}
            {isValid && (
                <div className="grid grid-cols-3 overflow-hidden">

                    <div className="col-span-2 divide-y border-gray-300 overflow-hidden text-center">
                        {mockPlaylist.map((song, idx) => (
                            <div key={idx} className="p-7 text-heading-h4 bg-primary-100 border-gray-300 ">
                                {song}
                            </div>
                        ))}
                    </div>

                    <div className="col-span-1 p-6 overflow-y-auto space-y-4">
                        {mockReviews.map((item, idx) => {
                            const [gen, type, suffix] = item.type.split(" ");

                            return (
                                <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-white">
                                    <p className="text-heading-h4 font-semibold">
                                        <span className="text-primary-300">{gen.replace("세대", "")}</span>
                                        <span className="text-black">세대 </span>
                                        <span className="text-primary-300">{type}</span>
                                        <span className="text-black"> {suffix}</span>
                                    </p>
                                    <p className="text-regular-16 mt-2 text-black">
                                        {item.review}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            )}
        </main>
    );
}
