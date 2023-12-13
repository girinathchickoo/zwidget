import truncate from "../../../utils/truncate";

export default function TokenContainer({
  type,
  chainData,
  coinData,
  amount,
  convertVal,
}) {
  console.log(coinData);
  return (
    <div className="text-text-primary border border-border-primary w-[40%] py-2 rounded-md flex flex-col items-center justify-center gap-y-2 bg-background-form">
      <p className="text-sm font-normal ">{type}</p>
      <p className=" text-sm md:text-lg leading-5 font-medium">
        {amount + " " + coinData?.symbol || ""}
      </p>
      <div className="flex leading-5 items-center gap-x-1">
        <div className="flex flex-col text-text-primary  justify-center items-center w-max gap-y-1">
          <p className="leading-[0px] p-0">~</p>
          <p className="leading-[0px] p-0">-</p>
        </div>
        <p>
          ${" "}
          {truncate(
            amount * convertVal.data?.[coinData?.priceId]?.usd || 0.0,
            2
          )}
        </p>
      </div>
      <div className="w-[36px] h-[36px] rounded-[50%]  relative">
        <img src={coinData.logoURI} alt="img" />
        <div className="w-[18px] h-[18px] absolute bottom-[-2px] right-[-5px] bg-background-darkgray rounded-[50%]">
          {" "}
          <img className="rounded-[50%]" src={chainData.image} alt="img" />
        </div>
      </div>
      <p className="text-sm font-normal">{chainData?.name}</p>
    </div>
  );
}
