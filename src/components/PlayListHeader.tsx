export default function PlayListHeader() {
    const userType = JSON.parse(localStorage.getItem('userType') || '{}');
    const generation = userType.generation || '';
    const type = userType.type || '';
    return (
        <section className="py-8 flex justify-center items-center border-b border-black bg-white">
            <h1 className="text-nickname text-black text-center">
                K-POP <span className="text-[#758BFD]">{generation}</span>세대 <span className="text-[#758BFD]">{type}</span> 유형
            </h1>
        </section>
    );
};