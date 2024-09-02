interface ITabs {
    tabList: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Tabs = ({tabList, activeTab, onTabChange}: ITabs) => {

    return (
        <>
        <button className="flex flex-row">
            {tabList.map((tab: string) => (
                <div
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`flex py-[16px] px-[32px] justify-center items-center gap-[8px] cursor-pointer text-main text-[18px] font-normal leading-[150%] ${activeTab === tab ? 'bg-white' : 'bg-hoverBg'}`}
                >
                    {tab}
                </div>
            ))}
        </button>
        </>
    );
}
export default Tabs;