import React, { useEffect, useState, useRef } from "react";
import RoundedButton from "../Button/RoundedButton";
import TokenContainer from "./TokenContainer";
import styles from "./ConfirmDetails.module.css";
import Exchange from "../Exchange";
import QuoteTimer from "./QuoteTimer";
import images from "../../images";
export default function ConfirmDetails({
  handleConfirmClose,
  routesData,
  fromChain,
  fromCoin,
  toChain,
  toCoin,
  amount,
  mode,
  handleMode,
  convertVal,
  routes,
  handleStopRoute,
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [isOpenExchange, setIsOpenExchange] = useState(false);
  const [slippage, setSlippage] = useState("3.5");

  const prevRoute = useRef();
  console.log(routesData, prevRoute.current, "routesdata");
  const { info, greentick, edit, gas, reverse, close } = images;
  useEffect(() => {
    if (
      !prevRoute.current &&
      Number(
        prevRoute?.current?.minOutputAmount ||
          prevRoute?.current?.outputAmountDisplay
      ) !==
        Number(routesData?.minOutputAmount || routesData?.outputAmountDisplay)
    )
      prevRoute.current = routesData;
  }, [routesData]);
  function handleOpenExchange() {
    setIsOpenExchange(!isOpenExchange);
  }
  return !isOpenExchange ? (
    <div>
      <div className="flex relative justify-center mb-2">
        <button
          onClick={handleConfirmClose}
          className="absolute left-0 top-[25%]"
        >
          <img src={close} width={12} height={5} alt="img" />
        </button>
        <div className="text-base font-normal text-text-search">
          Confirm Details
        </div>
      </div>
      <div className="w-full text-center">
        <QuoteTimer />
        {!routes.isFetching ? (
          <div className="flex justify-between items-center">
            <TokenContainer
              type="Send:"
              chainData={fromChain}
              coinData={fromCoin}
              amount={amount}
              convertVal={convertVal}
            />
            <RoundedButton
              classnames={`border w-[30px] h-[30px] relative z-10    border-border-secondary bg-background-graybutton`}
            >
              <img
                className="rotate-[-90deg] mt-[-2px] flex items-center justify-center"
                src={reverse}
                width={12}
                height={12}
                alt="img"
              />
            </RoundedButton>
            <div className="w-[20%] right-[40%] absolute h-[1px] bg-border-secondary "></div>
            <TokenContainer
              type="Receive:"
              chainData={toChain}
              coinData={toCoin}
              amount={Number(
                routesData?.minOutputAmount || routesData?.outputAmountDisplay
              )}
              convertVal={convertVal}
            />
          </div>
        ) : (
          <>Loading</>
        )}
        <div>
          <p className="text-sm font-normal my-1 text-text-primary">
            On{" "}
            {routesData?.protocolsUsed.map((item, i, arr) => {
              return (
                <span className="text-lg font-medium">
                  {i == arr.length - 1 ? item : `${item + " & "}`}
                </span>
              );
            })}{" "}
            via{" "}
            <span className="text-lg font-medium">
              {routesData?.provider || ""}
            </span>
          </p>
        </div>
        <div className="w-full text-left">
          <p className="text-sm font-medium text-text-form">Mode</p>
          <div className="border flex items-center bg-background-container relative justify-center gap-x-2 w-full h-[43px] border-border-mode">
            <div className="absolute right-[-1%] top-[-10%]">
              <img src={info} width={14} height={14} alt="img" />
            </div>
            <div className="w-[50%] absolute top-[-20%] flex items-center justify-center text-xs font-normal h-[14px] bg-background-mode">
              <p className="text-transparent bg-gradient-to-l bg-clip-text from-[#2CFFE4] to-[#A45EFF]">
                {mode} Mode
              </p>
            </div>
            <div className="flex items-center justify-center gap-x-1">
              <img src={gas} width={14} height={15} alt="img" />
              <p className="text-sm font-bold text-text-mode">
                0.0156 {routesData?.from?.blockchain || ""}
              </p>
            </div>
            <span className="text-text-mode1 font-medium text-sm">
              {" "}
              $ 20.00
            </span>
          </div>
          {mode == "Classic" ? (
            <div className="flex justify-center items-center gap-x-1">
              <p className="text-xs font-normal text-text-primary">
                Want to save Native Gas? Switch to
              </p>
              <span
                onClick={() => {
                  handleMode("Gasless");
                }}
                className="text-transparent cursor-pointer text-xs font-normal bg-gradient-to-l bg-clip-text from-[#2CFFE4] to-[#A45EFF]"
              >
                Gasless Mode
              </span>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-x-1">
              <p className="text-xs font-normal text-text-primary">
                Native gas will be paid by us.
              </p>
              <span className="text-transparent cursor-pointer text-xs font-normal bg-[#2CFFE4] bg-clip-text">
                Learn More
              </span>
            </div>
          )}
        </div>
        <div className="flex my-4 items-center justify-between">
          <div>
            <div className="flex items-center gap-x-1">
              <p className="text-sm font-normal mb-2 text-text-form">
                Slippage Tolerance
              </p>
              <button
                onClick={() => {
                  setIsEditable(true);
                }}
                className="bg-transparent"
              >
                <img src={info} width={14} height={14} alt="img" />
              </button>
            </div>
            <div className="flex items-center gap-x-2">
              <input
                disabled={!isEditable}
                value={slippage}
                onChange={(e) => {
                  setSlippage(e.target.value);
                }}
                type="number"
                className="w-[42px] border-b border-dashed pl-1 text-sm font-medium text-text-selected"
                placeholder="0.0%"
              />
              {!isEditable ? (
                <button
                  onClick={() => {
                    setIsEditable(true);
                  }}
                  className="bg-transparent"
                >
                  <img src={edit} width={12} height={12} alt="img" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditable(false);
                  }}
                  className="flex border border-border-secondary rounded-sm py-[3px] p-[2px] justify-center items-center"
                >
                  <img src={greentick} width={10} height={10} alt="img" />
                </button>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-1">
              <p className="text-sm font-normal mb-2 text-text-form">
                Price Impact
              </p>
              <button className="bg-transparent">
                <img src={info} width={14} height={14} alt="img" />
              </button>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="text-sm font-medium text-text-selected">2.05%</p>
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-background-graybutton my-4"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-normal text-text-primary">
              Current Rate ?
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-selected">
              1 MATIC = 0.82 USDC
            </p>
            <p className="text-xs font-normal text-text-primary">
              Polygon Bridge
            </p>
          </div>
        </div>
        {prevRoute.current &&
        Number(
          prevRoute.current?.minOutputAmount ||
            prevRoute.current?.outputAmountDisplay
        ) !==
          Number(
            routesData.minOutputAmount || routesData.outputAmountDisplay
          ) ? (
          <div className="w-full mt-4 flex ">
            <div className="w-1/2 text-left">
              <span className="text-lg font-medium text-text-selected">
                {(routesData?.minOutputAmount ||
                  routesData?.outputAmountDisplay) +
                  " " +
                  toCoin?.symbol || ""}
              </span>
              <p className="text-sm font-normal text-text-primary">$ 1920.80</p>
            </div>
            <button
              onClick={() => {
                handleOpenExchange();
                handleStopRoute();
              }}
              className={`text-lg w-1/2 font-bold text-white ${styles.gradientbutton}`}
            >
              Accept New Quote
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              handleOpenExchange();
              handleStopRoute();
            }}
            disabled={isEditable}
            className={`w-full disabled:opacity-60 h-[52px] mt-6 ${styles.gradientbutton} text-2xl font-bold text-text-button`}
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  ) : (
    <Exchange
      handleOpenExchange={handleOpenExchange}
      fromChain={fromChain}
      fromCoin={fromCoin}
      toChain={toChain}
      toCoin={toCoin}
      amount={amount}
      route={routesData}
    />
  );
}
