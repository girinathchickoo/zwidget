import React, { useEffect, useState } from "react";
import SelectChain from "../SelectChain";
import useStore from "../../zustand/store";
import prepareTx from "./prepareTxn";
import { useAccount } from "wagmi";
import {
  useSendTransaction,
  usePublicClient,
  usePrepareSendTransaction,
} from "wagmi";
import RoundedButton from "../Button/RoundedButton";
import styles from "./WidgetForm.module.css";
import { useQuery } from "react-query";
import controllers from "../../Actions/Controllers";
import LoadRoute from "./LoadRoute";
import AllRoutes from "./AllRoutes";
import truncate from "../../utils/truncate";
import { isEmpty } from "lodash";
import ConfirmDetails from "../ConfirmDetails";
export default function WidgetForm({ selectedWallet, handleShowWallet }) {
  const [amount, setAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
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
  const [routesData, setRoutesData] = useState([]);
  const [txnBodyData, setTxnBodyData] = useState();
  const publicClient = usePublicClient();
  const [confirmRoute, setConfirmRoute] = useState(false);
  const [mode, setMode] = useState("Classic");
  const [stopRoute,setStopRoute]=useState(true)
 


  const convertVal = useQuery(
    ["convert", fromCoin, toCoin],
    async () => {
      let res = await controllers.convertVal(
        fromCoin.priceId,
        toCoin.priceId,
        toCoin.coinKey
      );
      return await res.json();
    },
    {
      onSuccess: (data) => {
        console.log(data, "conertdata");
      },
    }
  );
  const routes = useQuery(
    [
      "routes",
      selectedWallet?.address,
      fromChain,
      toChain,
      fromCoin,
      toCoin,
      amount,
    ],
    async () => {
      let res = await controllers.fetchRoutes(
        selectedWallet?.address,
        fromChain,
        toChain,
        fromCoin,
        toCoin,
        amount
      );
      return res.json();
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retryOnMount:false,
      refetchInterval:60000,
      enabled:
        amount &&
        fromChain.chain.length &&
        fromCoin.coin.length &&
        toChain.chain.length &&
        toCoin.coin.length&& stopRoute
          ? true
          : false,
      onSuccess: (data) => {
        setRoutesData(data.quotes?.[0]?.[0] || [], "routesd");
      },
    }
  );
  function handleStopRoute(){
    setStopRoute(false)
  }
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
  function handleConfirmClose() {
    if (!isEmpty(routesData)) {
      setConfirmRoute(!confirmRoute);
    }
  }
  async function handleSubmit() {
    // setCallTxn(true);
    handleConfirmClose();
  }
  function handleRoutesData(data) {
    setRoutesData(data);
  }

  function handleMode(mode) {
    setMode(mode);
  }
  return (
    <div className="relative">
      <div className="absolute bottom-[-80px] bg-background-container rounded-[20px] left-[-20px] w-[443px] h-[43px]"></div>
      {!confirmRoute ? (
        !showAllRoutes ? (
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
              </div>
              <div className="border rounded-md border-border-primary bg-background-form">
                <div className="py-2 px-3 mb-5">
                  <p className="text-sm font-medium text-text-primary mb-2">
                    From
                  </p>
                  <div className="flex justify-between items-center">
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
                            <img
                              src="/down.svg"
                              width={9}
                              height={4}
                              alt="img"
                            />
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
                    <div className="flex flex-col items-end">
                      <input
                        autoFocus
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                        }}
                        placeholder="0.0"
                        className="text-3xl ml-auto mb-1 pl-1 w-[70px] max-w-[120px] font-normal text-text-[#5C5C5C] bg-transparent"
                      />
                      <div className="flex items-center gap-x-1">
                        <div className="flex flex-col text-text-primary  justify-center items-center w-max gap-y-1">
                          <p className="leading-[0px] p-0">~</p>
                          <p className="leading-[0px] p-0">-</p>
                        </div>
                        <p className="text-sm font-normal text-text-primary">
                          $
                          {amount * convertVal.data?.[fromCoin?.priceId]?.usd ||
                            0.0}
                        </p>
                      </div>
                      <div>
                        {fromCoin.coin.length ? (
                          <div className="flex items-center gap-x-1">
                            <p className="text-sm font-medium text-text-form">
                              {fromCoin?.availBal || 0}{" "}
                              {fromCoin?.coinKey || ""}
                            </p>
                            <button
                              className="text-[10px] font-normal px-1 border border-text-primary text-text-form"
                              onClick={() => {
                                setAmount(truncate(fromCoin?.availBal, 4));
                              }}
                            >
                              Max
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
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
                  <div className="flex justify-between items-center">
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
                            <img
                              src="/down.svg"
                              width={9}
                              height={4}
                              alt="img"
                            />
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
                    <div className="flex w-[60%] flex-col items-end">
                      <input
                        disabled
                        autoFocus
                        value={routesData?.minOutputAmount || 0}
                        onChange={(e) => {
                          setToAmount(e.target.value);
                        }}
                        placeholder="0.0"
                        className="text-3xl text-right  w-full ml-auto mb-1 pl-1  font-normal text-text-[#5C5C5C] bg-transparent"
                      />
                      <div className="flex items-center gap-x-1">
                        <div className="flex flex-col text-text-primary  justify-center items-center w-max gap-y-1">
                          <p className="leading-[0px] p-0">~</p>
                          <p className="leading-[0px] p-0">-</p>
                        </div>
                        <p className="text-sm font-normal text-text-primary">
                          $
                          {routesData?.minOutputAmount ||
                            0 * convertVal.data?.[toCoin?.priceId]?.usd ||
                            0.0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p>Mode</p>
                <button
                  onClick={() => {
                    handleMode("Classic");
                  }}
                >
                  classic
                </button>
                <button
                  onClick={() => {
                    handleMode("Gasless");
                  }}
                >
                  Gasless
                </button>
              </div>
              <div>
                <LoadRoute
                  routes={routes}
                  handleShowAllRoutes={handleShowAllRoutes}
                  fromChain={fromChain}
                  routesData={routesData}
                  price={
                    routesData?.minOutputAmount ||
                    0 * convertVal.data?.[toCoin?.priceId]?.usd ||
                    0
                  }
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
              selectedWallet={selectedWallet}
            />
          )
        ) : (
          <AllRoutes
            routes={routes}
            fromChain={fromChain}
            handleShowAllRoutes={handleShowAllRoutes}
            handleRoutesData={handleRoutesData}
            convertVal={convertVal.data?.[toCoin?.priceId]?.usd || 0}
          />
        )
      ) : (
        <ConfirmDetails
          handleConfirmClose={handleConfirmClose}
          fromCoin={fromCoin}
          toCoin={toCoin}
          fromChain={fromChain}
          toChain={toChain}
          amount={amount}
          routesData={routesData}
          mode={mode}
          handleMode={handleMode}
          convertVal={convertVal}
          routes={routes}
          handleStopRoute={handleStopRoute}
        />
      )}
    </div>
  );
}
