import './tabs.css';

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
                    className={`tab ${activeTab === tab ? 'bg-[white]' : 'bg-[hoverBg]'}`}
                >
                    {tab}
                </div>
            ))}
        </button>
        </>
    );
}
export default Tabs;