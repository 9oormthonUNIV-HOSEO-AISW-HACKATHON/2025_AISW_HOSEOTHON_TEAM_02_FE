import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Nextbutton_Left from "../assets/img/Nextbutton_Left.svg";


export default function SharePage() {
    const navigate = useNavigate();
    const code = "AFENTW"; // 리뷰페이지에서 넘어온 코드라고 가정

    const mockShareList = [
        {
            reviewer: "1세대 힙합 유형",
            playlist: [
                "HOT - 전사의 후예",
                "젝키 - 커플",
                "god - 촛불 하나",
                "신화 - Perfect Man",
                "에픽하이 - Paris"
            ],
        },
        {
            reviewer: "3세대 힙합 유형",
            playlist: [
                "빅뱅 – FANTASTIC BABY",
                "2NE1 - I DON’T CARE",
                "에픽하이 - 우산",
                "태양 - WHERE U AT",
                "블락비 - VERY GOOD"
            ],
        },
        {
            reviewer: "4세대 힙합 유형",
            playlist: [
                "스트레이키즈 - Back Door",
                "ATEEZ - HALA HALA",
                "TXT - 0X1=LOVESONG",
                "엔하이픈 - Drunk-Dazed",
                "NCT DREAM - Hot Sauce"
            ],
        },
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <main className="min-h-screen grid grid-rows-[auto_auto_auto_1fr] overflow-hidden">
            <Header />

            <div className="text-center py-8 border-b border-black">
                <h1 className="text-nickname">주고받은 플레이리스트</h1>
            </div>

            <div className="grid grid-cols-3 border-y border-black text-center">
                <button
                    className="col-span-1 text-heading-h4 p-6 border-r border-black hover:bg-hover-white transition flex items-center justify-center gap-5"
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

                <div className="col-span-1 border-r border-black overflow-y-auto">
                    {mockShareList.map((item, idx) => {
                        const [gen, type, suffix] = item.reviewer.split(" ");

                        const active = selectedIndex === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={`w-full text-left px-6 py-7 border-b border-black 
                                ${active ? "bg-hover-white" : "bg-white"}`}
                            >
                                <span className="text-heading-h4 font-semibold">
                                    <span className="text-primary-300">
                                        {gen.replace("세대", "")}
                                    </span>
                                    <span className="text-black">세대 </span>
                                    <span className="text-primary-300">{type}</span>
                                    <span className="text-black"> {suffix}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="col-span-2 divide-y border-black overflow-hidden text-center">
                    {mockShareList[selectedIndex].playlist.map((song, idx) => (
                        <div
                            key={idx}
                            className="p-7 text-heading-h4 bg-primary-100 border-b border-black"
                        >
                            {song}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
