import truncate from "../../utils/truncate";
export default function TokenBox({ chainData, coinData, amount }) {
  console.log(coinData);
  return (
    <div className="bg-background-form min-w-[153px] flex flex-col items-center justify-center rounded-md h-[63px] border border-border-primary">
      <div className="text-lg text-center font-medium text-text-selected">
        <span>{truncate(amount, 4)}</span>{" "}
        <span>{coinData?.coinKey || ""}</span>
        <p className="text-sm font-medium text-text-primary">{`on ${chainData.name}`}</p>
      </div>
    </div>
  );
}