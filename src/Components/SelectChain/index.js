import { useEffect } from "react";

export default function SelectChain({ setData, handleReset, data }) {
  const chainList = ["Ethereum", "Arbitrum", "Polygon", "linea"];
  const coinList = ["ETH", "BTC", "BTB", "SHIB"];
  useEffect(() => {
    if (data.chain.length && data.coin.length) {
      handleReset();
    }
  }, [data]);
  return (
    <>
      <div>
        <p>Select Chain</p>
        {chainList.map((item, i) => {
          return (
            <div
              onClick={() => {
                setData({ chain: item });
              }}
              style={{ cursor: "pointer" }}
              key={i}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div>
        <p>Select Coin</p>
        {coinList.map((item, i) => {
          return (
            <div
              onClick={() => {
                setData({ coin: item });
              }}
              key={i}
            >
              {item}
            </div>
          );
        })}
      </div>
    </>
  );
}
