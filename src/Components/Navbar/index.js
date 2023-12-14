import images from "../../images";

export default function Navbar() {
  const { tradebridge, gas, history } = images;
  return (
    <div className="absolute bottom-[-80px] flex items-center justify-between px-3 md:px-10 bg-background-container rounded-[20px] md:left-[-20px] w-full md:w-[443px] h-[43px]">
      <button>
        <img src={tradebridge} />
      </button>
      <button className="flex items-center gap-x-1">
        <img src={gas} width={16} height={18} alt="img" />
        <p className=" text-sm md:text-sm font-normal  text-text-primary">
          Gas Station
        </p>
      </button>
      <button className="flex items-center gap-x-1">
        <img src={history} width={16} height={18} alt="img" />
        <p className="text-xs md:text-sm font-normal  text-text-primary">
          History
        </p>
      </button>
    </div>
  );
}
