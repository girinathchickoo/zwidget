import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import controllers from "../../Actions/Controllers";
import ShowMoreNetworks from "./ShowMoreNetworks";
import styles from "./Selectchain.module.css";
export default function SelectChain({
  setChainData,
  setCoinData,
  handleReset,
  chainData,
  coinData,
  fromCoin,
  toCoin,
  fromChain,
  toChain,
  showExchangeList,
  selectedWallet,
}) {
  const [showMoreNetwork, setShowMoreNetwork] = useState(false);
  const [value, setValue] = useState("");

  const fetchChains = useQuery(
    "chains",
    async function () {
      let res = await controllers.fetchChain();
      return await res.json();
    },
    {
      enabled: chainData?.chain?.length ? false : true,
      onSuccess: (datas) => {
        let obj = {};
        datas.forEach((item) => {
          if (item.name.toLowerCase() == "ethereum") {
            setChainData({ ...chainData, chain: item.name, ...item });
          }
        });
      },
    }
  );
  const fetchTokens = useQuery(["tokens", chainData], async function () {
    let res = await controllers.fetchTokens(chainData.chainId);
    return await res.json();
  });
  const fetchBalance = useQuery(
    ["balance", selectedWallet?.address],
    async () => {
      let res = await controllers.fetchBalance(selectedWallet?.address);
      return await res.json();
    },
    {
      enabled: selectedWallet?.address ? true : false,
    }
  );
  // useEffect(() => {
  //   if (data.chain.length && data.coin.length) {
  //     // handleReset();
  //   }
  // }, [data]);
  function handleClosePopup(chainData, coinData) {
    console.log(chainData, coinData, "datas");
    if (chainData.chain?.length && coinData?.coin?.length) {
      handleReset();
    }
  }
  console.log(fetchBalance, "bal");
  function handleBack() {
    setShowMoreNetwork(false);
  }
  function handleSetChainData(data) {
    console.log(data, "set");
    setChainData(data);
  }
  console.log(fromChain, toChain, "chsin");
  return showMoreNetwork ? (
    <ShowMoreNetworks
      handleSetChainData={handleSetChainData}
      data={fetchChains.data}
      handleBack={handleBack}
      network={chainData}
      handleClosePopup={handleClosePopup}
    />
  ) : (
    <>
      <div>
        <div className="flex relative justify-center mb-2">
          <button
            onClick={() => {
              handleReset();
              if (!coinData.coin.length || !chainData.chain.length) {
                setCoinData({ coin: "" });
                setChainData({ chain: "" });
              } else {
              }
            }}
            className="absolute left-0 top-[25%]"
          >
            <img src="/close.svg" width={12} height={5} alt="img" />
          </button>
          <div className="text-base font-normal text-text-search">Network</div>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-5 overflow-y-auto">
          {fetchChains?.data?.slice(0, 9).map((item, i) => {
            console.log(chainData.name, item.name);
            return (
              <div
                className={` ${
                  chainData.name == item.name
                    ? styles.gradientbackground
                    : "bg-transparent"
                } p-[2px] rounded-[7px]`}
              >
                <div
                  onClick={() => {
                    let newObj = {
                      ...chainData,
                      chain: item.name,
                      ...item,
                    };
                    handleSetChainData(newObj);
                    // handleClosePopup(newObj,coinData);
                  }}
                  className="p-2 w-[70px] h-[53px] bg-background-network  rounded-md flex flex-col justify-center items-center"
                  style={{ cursor: "pointer" }}
                  key={i}
                >
                  <img
                    src={item.image}
                    width={25}
                    className="rounded-[50%]"
                    height={25}
                    alt="img"
                  />{" "}
                  <p
                    className={`text-xs text-center  ${
                      chainData.name == item.name
                        ? "text-text-selected font-medium"
                        : "text-text-primary font-normal"
                    }`}
                  >
                    {item.name.length > 7
                      ? item.name.substring(0, 7) + ".."
                      : item.name}
                  </p>
                  {chainData?.chain == item ? (
                    <img width={10} height={10} src="/tick.png" />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          })}
          <div
            onClick={() => {
              setShowMoreNetwork(true);
            }}
            className="p-2 w-[70px] h-[53px] bg-background-network  rounded-md flex flex-col justify-center items-center"
            style={{ cursor: "pointer" }}
          >
            <p className="text-xl font-medium text-text-primary">
              +{fetchChains.data?.length - 9}
            </p>
            <p className="text-xs font-normal text-text-primary">Networks</p>
          </div>
        </div>
      </div>
      <div>
        <div className="relative mt-4">
          <input
            type={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            className={`text-sm px-2 w-full h-[34px] ${
              !value.length
                ? "border border-border-primary"
                : "border border-border-green"
            } rounded-[5px] font-normal text-text-search`}
            placeholder="Search Network"
          />
          <img
            className="absolute right-2 bg-background-container top-2"
            width={16}
            height={16}
            src="/search.svg"
            alt="img"
          />
        </div>
        <div className=" h-[200px] md:h-[380px] mt-2 overflow-y-auto">
          {fetchTokens?.data
            ?.filter((item) => {
              return (
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.symbol.toLowerCase().includes(value.toLowerCase())
              );
            })
            .map((item, i) => {
              return (
                <div
                  className={`py-2
                  ${
                    showExchangeList == "from" &&
                    // toCoin.coinKey !== item.coinKey &&
                    toCoin.name !== item.name
                      ? ""
                      : showExchangeList == "to" &&
                        // fromCoin.coinKey !== item.coinKey &&
                        fromCoin.name !== item.name
                      ? ""
                      : toChain.name !== fromChain.name
                      ? ""
                      : "pointer-events-none opacity-60"
                  }
                   flex items-center justify-between cursor-pointer border-b border-border-primary
                   
                  }`}
                  onClick={async () => {
                    let newObj = {
                      ...coinData,
                      coin: item.symbol,
                      ...item,
                      availBal:
                        fetchBalance.data?.evm?.[chainData.chainId]?.[
                          item.address.toLowerCase()
                        ]?.balance /
                        Math.pow(
                          10,
                          fetchBalance.data?.evm?.[chainData.chainId]?.[
                            item.address.toLowerCase()
                          ]?.decimals || 0
                        ),
                    };

                    setCoinData(newObj);
                    if (
                      showExchangeList == "from" &&
                      // toCoin.coinKey !== item.coinKey &&
                      toCoin.name !== item.name
                    ) {
                      console.log("called 1", newObj);
                      handleClosePopup(chainData, newObj);
                      setCoinData(newObj);
                    } else if (
                      showExchangeList == "to" &&
                      // fromCoin.coinKey !== item.coinKey &&
                      fromCoin.name !== item.name
                    ) {
                      console.log("called 2");
                      handleClosePopup(chainData, newObj);
                      setCoinData(newObj);
                    } else if (toChain.name !== fromChain.name) {
                      handleClosePopup(chainData, newObj);
                      setCoinData(newObj);
                      console.log("called 3");
                    }
                  }}
                  key={i}
                >
                  <div className="flex items-center justify-center w-max gap-x-2">
                    <div className="relative">
                      <img
                        src={item.logoURI}
                        width={25}
                        height={25}
                        alt="img"
                      />
                      <img
                        src={chainData.image}
                        className={
                          "absolute right-0 bottom-[-2px] border border-border-secondary rounded-[50%]"
                        }
                        width={10}
                        height={10}
                        alt="img"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-form">
                        <span className="font-medium">
                          {item.symbol || ""}{" "}
                        </span>
                        {item.name}
                      </p>{" "}
                      <p className="text-xs font-normal  text-text-form">
                        {chainData.name}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-form">
                      {fetchBalance.data?.evm?.[chainData.chainId]?.[
                        item.address.toLowerCase()
                      ]?.balance /
                        Math.pow(
                          10,
                          fetchBalance.data?.evm?.[chainData.chainId]?.[
                            item.address.toLowerCase()
                          ]?.decimals || 0
                        ) || ""}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
