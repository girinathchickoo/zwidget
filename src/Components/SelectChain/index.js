import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import controllers from "../../Actions/Controllers";
import ShowMoreNetworks from "./ShowMoreNetworks";
import styles from "./Selectchain.module.css";
import COLOR_PALLETTE from "../../Constants/theme/colors";
export default function SelectChain({ setChainData,setCoinData, handleReset, chainData,coinData }) {
  const [showMoreNetwork, setShowMoreNetwork] = useState(false);
  const [value, setValue] = useState("");
  const fetchChains = useQuery(
    "chains",
    async function () {
      let res = await controllers.fetchChain();
      return await res.json();
    },
    {
      enabled: !coinData.coin.length && !chainData.chain.length,
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
  // useEffect(() => {
  //   if (data.chain.length && data.coin.length) {
  //     // handleReset();
  //   }
  // }, [data]);
  function handleClosePopup(chainData,coinData) {
    console.log(chainData,coinData,"datas")
    if (chainData.chain?.length && coinData?.coin?.length) {
      handleReset();
    }
  }
  function handleBack() {
    setShowMoreNetwork(false);
  }
  function handleSetChainData(data) {
    console.log(data,'set')
    setChainData(data);
  }
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
              if (!coinData.coin.length || !chainData.chain.length){
                setCoinData({ coin: ""});
                setChainData({ chain: "" });
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
            console.log(chainData.name,item.name)
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
        <div className="h-[380px] mt-2 overflow-y-auto">
          {fetchTokens?.data
            ?.filter((item) => {
              return (
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.coinKey.toLowerCase().includes(value.toLowerCase())
              );
            })
            .map((item, i) => {
              return (
                <div
                  className="py-2 cursor-pointer border-b border-border-primary"
                  onClick={() => {
                    let newObj = { ...coinData, coin: item.coinKey, ...item };
                    setCoinData(newObj);
                    handleClosePopup(chainData,newObj);
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
                        <span className="font-medium">{item.coinKey} </span>
                        {item.name}
                      </p>{" "}
                      <p className="text-xs font-normal  text-text-form">
                        {chainData.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
