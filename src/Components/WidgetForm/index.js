import React, { useEffect, useState } from "react";
import SelectChain from "../SelectChain";
import useStore from "../../zustand/store";
import prepareTx from "./prepareTxn";
import { useAccount } from "wagmi";
import { useSendTransaction, usePublicClient, use } from "wagmi";
import RoundedButton from "../Button/RoundedButton";
import styles from "./WidgetForm.module.css";
import { useQuery } from "react-query";
import controllers from "../../Actions/Controllers";
import LoadRoute from "./LoadRoute";
import AllRoutes from "./AllRoutes";
export default function WidgetForm({ selectedWallet, handleShowWallet }) {
  console.log(selectedWallet, "wallet");
  const [amount, setAmount] = useState("");
  const [fromChain, setFromChain] = useState({ chain: "" });
  const [fromCoin, setFromCoin] = useState({ coin: "" });
  const { isConnected } = useAccount();
  const [toChain, setToChain] = useState({ chain: "" });
  const [toCoin, setToCoin] = useState({ coin: "" });
  const [showExchangeList, setShowExchangeList] = useState();
  const walletData = useStore((state) => state.walletData);
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [isSwap, setIsSwap] = useState(false);
  const [callTxn, setCallTxn] = useState(false);
  const [txnBodyData, setTxnBodyData] = useState();
  const publicClient = usePublicClient();
  console.log(publicClient, "client");
  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    value: 10,

    ...txnBodyData?.data?.[1]?.txnEvm,
    from: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    to: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    // gasPrice: txnBodyData?.gasPrice,
    // gasLimit: txnBodyData?.gasLimit,
  });
  // const {
  //   data: data1,
  //   isLoading: isLoading1,
  //   isSuccess: isSuccess1,
  //   sendTransaction: sendTransaction1,
  // } = useSendTransaction({
  //   value: 0,
  //   ...txnBodyData?.data?.[1]?.txnEvm,
  //   gasPrice: txnBodyData?.gasPrice,
  //   gasLimit: txnBodyData?.gasLimit,
  // });
  const routes = useQuery(
    ["routes", selectedWallet?.address],
    async () => {
      let res = await controllers.fetchRoutes(selectedWallet?.address);
      return res.json();
    },
    {
      enabled:
        amount &&
        fromChain.chain.length &&
        fromCoin.coin.length &&
        toChain.chain.length &&
        toCoin.coin.length
          ? true
          : false,
    }
  );
  const txnBody = useQuery(
    "txnbody",
    async () => {
      console.log("called");
      let res = await controllers.fetchTxnBody(
        `/createTx?fromChainId=137&toChainId=137&fromAssetAddress=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&toAssetAddress=0xc2132D05D31c914a87C6611C10748AEb04B58e8F&inputAmount=50&recipient=${selectedWallet?.address}&routeId=${routes.data?.routes?.[0]?.[0]?.routeId}`
      );
      return await res.json();
    },

    {
      enabled: callTxn,
      onSuccess: async (data) => {
        let gasLimit = await publicClient.estimateGas({
          account: selectedWallet?.address,
          ...data?.result?.[1]?.txnEvm,
        });
        let gasPrice = await publicClient.getGasPrice({
          account: selectedWallet?.address,
          ...data?.result?.[1]?.txnEvm,
        });
        setTxnBodyData({ data: data?.result, gasPrice, gasLimit });
        sendTransaction();
        // let gasLimit1 = await publicClient.estimateGas({
        //   account: selectedWallet?.address,
        //   ...data?.result?.[1]?.txnEvm,
        // });
        // let gasPrice1 = await publicClient.getGasPrice({
        //   account: selectedWallet?.address,
        //   ...data?.result?.[1]?.txnEvm,
        // });
        // console.log(gasPrice1, gasLimit1, txnBodyData, "pric1");
        // setTxnBodyData({
        //   data: data?.result,
        //   gasPrice: gasPrice1,
        //   gasLimit: gasLimit1,
        // });
        // sendTransaction1();
        setCallTxn(false);
      },
      onError: () => {
        setCallTxn(false);
      },
    }
  );
  console.log(txnBodyData, "body");
  function handleResetList() {
    setShowExchangeList();
  }
  function handleChain(data) {
    if (showExchangeList == "from") {
    setFromChain({ ...fromChain, ...data });
    } else if (showExchangeList == "to") {
      setToChain({ ...toChain, ...data });
    }
  }
  function handleCoin(data) {
    if (showExchangeList == "from") {
      setFromCoin({ ...fromCoin, ...data });
    } else if (showExchangeList == "to") {
      setToCoin({ ...toCoin, ...data });
    }
  }
  function callTransaction() {
    prepareTx(walletData).then((res) => console.log(res, "resp"));
  }
  function handleShowAllRoutes() {
    setShowAllRoutes(!showAllRoutes);
  }
  useEffect(() => {
    if (
      fromChain.chain?.length &&
      toChain.chain?.length &&
      fromCoin.coin?.length &&
      toCoin.coin?.length
    ) {
      callTransaction();
    }
  }, [fromChain, toChain, toCoin, fromCoin]);
  async function handleSubmit() {
    setCallTxn(true);
  }
  console.log(routes, "routes");
  return (
    <div className="relative">
      {!showAllRoutes ? (
        !showExchangeList ? (
          <>
            <div className="flex mb-5  items-center justify-between">
              <p className="text-lg font-medium text-text-primary">
                Trade/Bridge
              </p>

              <div className="flex items-center gap-x-2">
                <RoundedButton classnames={"bg-background-graybutton"}>
                  <img src="/refresh.svg" width="16" height="16" alt="img" />
                </RoundedButton>
                <RoundedButton
                  classnames={
                    "bg-background-graybutton shadow-sm shadow-shadow-button  "
                  }
                >
                  <img src="/filter.svg" width="16" height="16" alt="img" />
                </RoundedButton>
              </div>

              <div className="absolute bottom-[-80px] bg-background-container rounded-[20px] left-[-20px] w-[443px] h-[43px]"></div>
            </div>
            <div className="border rounded-md border-border-primary bg-background-form">
              <div className="py-2 px-3 mb-5">
                <p className="text-sm font-medium text-text-primary mb-2">
                  From
                </p>
                <div>
                  <div className="flex items-center gap-x-3">
                    {fromCoin.logoURI && fromChain.image ? (
                      <div className="w-[36px] h-[36px] rounded-[50%]  relative">
                        <img src={fromCoin.logoURI} alt="img" />
                        <div className="w-[18px] h-[18px] absolute bottom-[-2px] right-[-5px] bg-background-darkgray rounded-[50%]">
                          {" "}
                          <img
                            className="rounded-[50%]"
                            src={fromChain.image}
                            alt="img"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-[36px] h-[36px] rounded-[50%] bg-background-graybutton relative">
                        <div className="w-[18px] h-[18px] absolute bottom-[-2px] right-[-5px] bg-background-darkgray rounded-[50%]"></div>
                      </div>
                    )}
                    {!fromChain.chain?.length && !fromCoin.coin?.length ? (
                      <div
                        onClick={() => {
                          setShowExchangeList("from");
                        }}
                        className={` p-[1px] cursor-pointer ${styles.gradientborder} rounded-[20px] w-max`}
                      >
                        <div className="text-sm font-medium w-max bg-background-form rounded-[20px] flex justify-center gap-x-2 px-3 text-text-form">
                          <p>Select Token</p>
                          <img src="/down.svg" width={9} height={4} alt="img" />
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setShowExchangeList("from");
                        }}
                        className="cursor-pointer"
                      >
                        <p className="text-base font-medium text-text-primary">
                          {fromCoin.coin}
                        </p>
                        <p className="text-xs font-medium text-text-primary">
                          on {fromChain.chain}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="w-full flex justify-end">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      placeholder="~ $0.0"
                      className="text-sm w-[60px] font-normal text-text-primary bg-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] flex justify-center relative bg-background-graybutton">
                <RoundedButton
                  callback={() => {
                    setIsSwap(!isSwap);
                    setFromChain(toChain);
                    setFromCoin(toCoin);
                    setToChain(fromChain);
                    setToCoin(fromCoin);
                  }}
                  classnames={
                    "absolute flex top-[-15px] bg-background-form justify-center items-center w-[32px] h-[32px] border border-border-secondary"
                  }
                >
                  <img
                    src="/reverse.svg"
                    className={`${isSwap ? "rotate-180" : ""}`}
                    width={11}
                    height={17}
                    alt="img"
                  />
                </RoundedButton>
              </div>
              <div className="py-5 pb-5 px-3 mb-5">
                <p className="text-sm  font-medium text-text-primary mb-2">
                  To
                </p>
                <div>
                  <div className="flex items-center gap-x-3">
                    {toCoin.logoURI && toChain.image ? (
                      <div className="w-[36px] h-[36px] rounded-[50%]  relative">
                        <img src={toCoin.logoURI} alt="img" />
                        <div className="w-[18px] h-[18px] absolute bottom-[-2px] right-[-5px] bg-background-darkgray rounded-[50%]">
                          {" "}
                          <img
                            className="rounded-[50%]"
                            src={toChain.image}
                            alt="img"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-[36px] h-[36px] rounded-[50%] bg-background-graybutton relative">
                        <div className="w-[18px] h-[18px] absolute bottom-[-2px] right-[-5px] bg-background-darkgray rounded-[50%]"></div>
                      </div>
                    )}
                    {!toChain.chain?.length && !toChain.coin?.length ? (
                      <div
                        onClick={() => {
                          setShowExchangeList("to");
                        }}
                        className={` p-[1px] cursor-pointer ${styles.gradientborder} rounded-[20px] w-max`}
                      >
                        <div className="text-sm font-medium w-max bg-background-form rounded-[20px] flex justify-center gap-x-2 px-3 text-text-form">
                          <p>Select Token</p>
                          <img src="/down.svg" width={9} height={4} alt="img" />
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setShowExchangeList("to");
                        }}
                        className="cursor-pointer"
                      >
                        <p className="text-base font-medium text-text-primary">
                          {toCoin.coin}
                        </p>
                        <p className="text-xs font-medium text-text-primary">
                          on {toChain.chain}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <LoadRoute
                routes={routes}
                handleShowAllRoutes={handleShowAllRoutes}
                fromChain={fromChain}
              />
            </div>
            <button
              className={`w-full h-[52px] mt-6 ${styles.gradientbutton} text-2xl font-bold text-text-button`}
              onClick={() => {
                !isConnected
                  ? handleShowWallet(true)
                  : handleSubmit(selectedWallet);
              }}
            >
              {isConnected ? "Review Route" : "Connect Wallet"}
            </button>
          </>
        ) : (
          <SelectChain
            chainData={showExchangeList == "from" ? fromChain : toChain}
            coinData={showExchangeList == "from" ? fromCoin : toCoin}
            setChainData={handleChain}
            setCoinData={handleCoin}
            handleReset={handleResetList}
            toCoin={toCoin}
            fromCoin={fromCoin}
            showExchangeList={showExchangeList}
            fromChain={fromChain}
            toChain={toChain}
          />
        )
      ) : (
        <AllRoutes
          routes={routes}
          fromChain={fromChain}
          handleShowAllRoutes={handleShowAllRoutes}
        />
      )}
    </div>
  );
}
