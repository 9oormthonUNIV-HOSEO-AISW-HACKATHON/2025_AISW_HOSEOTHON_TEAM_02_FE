export default function PlayListHeader() {
    const userType = JSON.parse(localStorage.getItem('userType') || '{}');
    const generation = userType.generation || '';
    const type = userType.type || '';
    return (
        <section className="py-10 h-[200px] flex justify-center items-center border-b border-gray-300 bg-white">
            <h2 className="text-7xl font-black text-black tracking-tight text-center">
                K-POP <span className="text-[#758BFD]">{generation}</span>세대 <span className="text-[#758BFD]">{type}</span> 유형
            </h2>
        </section>
    );
};