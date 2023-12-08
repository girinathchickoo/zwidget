export default function Navbar() {
  return (
    <div className="absolute bottom-[-80px] flex items-center justify-between px-10 bg-background-container rounded-[20px] left-[-20px] w-[443px] h-[43px]">
      <button>
        <img src="/tradebridge.svg" />
      </button>
      <button className="flex items-center gap-x-1">
        <img src="/gas.svg" width={16} height={18} alt="img" />
        <p className="text-sm font-normal  text-text-primary">Gas Station</p>
      </button>
      <button className="flex items-center gap-x-1">
        <img src="/history.svg" width={16} height={18} alt="img" />
        <p className="text-sm font-normal  text-text-primary">History</p>
      </button>
    </div>
  );
}
