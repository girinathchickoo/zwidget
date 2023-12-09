import TokenBox from "./TokenBox";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import controllers from "../../Actions/Controllers";
import {
  useSendTransaction,
  usePrepareSendTransaction,
  useSwitchNetwork,
} from "wagmi";
import useStore from "../../zustand/store";
import RoundedButton from "../Button/RoundedButton";
import styles from "./Exchange.module.css";
let interval;
const Exchange = React.memo(function ({
  handleOpenExchange,
  fromCoin,
  toCoin,
  fromChain,
  toChain,
  amount,
  route,
}) {
  const txnStepText = {
    approval: {
      pre: {
        name: "approval",
        title: `Approve ${fromCoin?.coinKey} Token Allowance`,
        description: `Please approve spending cap for ${fromCoin?.coinKey} in your wallet`,
        buttonText: `Approve ${fromCoin?.coinKey}`,
      },
      process: {
        name: "approval",
        title: `Processing ${fromCoin?.coinKey} Token Allowance`,
        description:
          "We're awaiting token allowance confirmation on the blockchain.",
        buttonText: "Processing",
      },
    },
    swap: {
      pre: {
        name: "swap",
        title: `Sign Swap transaction`,
        description: `Please sign the swap transaction in your wallet.`,
        buttonText: `Sign Transaction`,
      },
      process: {
        name: "swap",
        title: `Processing Swap transaction`,
        description:
          "We're waiting for the swap transaction to confirm on the blockchain.",
        buttonText: "Processing",
      },
    },
    bridge: {
      pre: {
        name: "switch",
        title: `Switch Chain`,
        description: `Please approve spending cap for USDC in your wallet`,
        buttonText: `Switch Chain to ${fromCoin.name} `,
      },
    },
  };
  const textKey = Object.entries(txnStepText);
  const [txnEvm, setTxnEvm] = useState({});
  const [stepData, setStepData] = useState({});
  const [allSteps, setAllSteps] = useState({ steps: null, currentStep: 0 });
  const [showErrorMsg, setShowErrorMsg] = useState("");
  const [stepTextObj, setStepTextObj] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const { chains, error, switchNetwork } = useSwitchNetwork();
  const prepare = usePrepareSendTransaction({
    to: toCoin.address,
    value: 0,
  });
  const walletData = useStore((state) => state.walletData);
  useEffect(() => {
    if (fromChain?.id !== walletData?.id) {
      console.log("called switch", fromChain?.id);
      switchNetwork(fromChain?.chainId);
    }
  }, [walletData, fromChain]);
  console.log(walletData, fromChain, "Walletdata");
  const { data, isLoading, isError, sendTransaction, reset } =
    useSendTransaction({
      value: 0,
      ...prepare,
      ...txnEvm,
    });
  const txnBody = useQuery(
    ["txnbody", route?.routeId],
    async () => {
      let res = await controllers.fetchTxnBody(
        `/createTx?routeId=${route?.routeId || ""}`
      );
      return await res.json();
    },

    {
      refetchOnWindowFocus: false,
      onSuccess: async (data) => {
        console.log(data, "opdata");
        const {
          routeId,
          steps: [item],
        } = data;
        handleStepText(item, "pre");
        setStepData(item);
        setTimeout(() => {
          callNextTx(data?.steps[0], data?.routeId);
        }, 0);
      },
      onError: () => {},
    }
  );
  const nextTx = useMutation(
    "nexttx",
    async ({ id, routeId }) => {
      console.log(routeId, id, "mutate  ");
      let res = await controllers.fetchNextTx(id, routeId);
      return await res.json();
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log(data, "evmdata");
        setDisableButton(false);
        setTxnEvm(data.txnEvm);
        if (!allSteps.steps) {
          console.log(txnBody, "createtxn");
          setAllSteps({ steps: txnBody?.data?.steps, currentStep: 0 });
          handleStepText(txnBody?.data?.steps[0], "pre");
        } else {
          setAllSteps({ ...allSteps, currentStep: allSteps.currentStep + 1 });
          handleStepText(allSteps.steps[allSteps.currentStep + 1], "pre");
        }
      },
    }
  );
  function handleStepText(data, type) {
    let tempobj = {};
    textKey.forEach(([key, val]) => {
      if (data?.stepType?.includes(key)) {
        tempobj = val[type];
        setStepTextObj(tempobj);
      }
    });
  }
  console.log(isError, "errorr");
  const fetchStatus = useMutation(
    "status",
    async ({ routeId, stepId, txnHash }) => {
      let res = await controllers.fetchStatus(routeId, stepId, txnHash);
      return res.json();
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: (data) => {
        if (data.txnStatus == "success" || data.txnStatus == "failed") {
          clearInterval(interval);
          setStepData(allSteps.steps[allSteps.currentStep + 1]);
          console.log(allSteps, "ALL");
          callNextTx(
            allSteps.steps[allSteps.currentStep + 1],
            txnBody.data?.routeId
          );
        } else {
          handleStepText(allSteps.steps[allSteps.currentStep + 1], "pre");
        }
      },
      onError: () => {
        handleStepText(allSteps.steps[allSteps.currentStep], "process");
      },
    }
  );
  console.log(data, "Data");
  console.log(allSteps, "allsteps");
  console.log(stepTextObj, "textobj");
  async function callStatus() {
    try {
      await fetchStatus.mutateAsync({
        routeId: txnBody.data.routeId,
        stepId: stepData?.id,
        txnHash: data.hash,
      });
      console.log("tried");
    } catch (err) {
      console.log(err);
      console.log("catched", err);
    }
  }
  async function callNextTx(stepval, routeval) {
    console.log(stepval, "txndata");
    try {
      console.log(stepval?.id, "txndata");
      await nextTx.mutateAsync({
        id: stepval?.id,
        routeId: routeval,
      });
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (isError) {
      console.log("reset done");
      reset();
    }
  }, []);

  useEffect(() => {
    if (!isError && data) {
      console.log("call status");
      interval = setInterval(() => {
        callStatus();
      }, 5000);
    }
    if (isError) {
      setDisableButton(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isError, data]);
  async function handleStep() {
    setDisableButton(true);
    sendTransaction();
    handleStepText(allSteps.steps[allSteps?.currentStep || 0], "process");
  }
  function getStepName(steptype, status) {
    const stepTextArr = Object.keys(txnStepText);
    let text = "";
    stepTextArr.forEach((item) => {
      if (steptype?.stepType?.includes(item?.toLowerCase())) {
        console.log(item, "for", txnStepText[item]?.[status]?.title);
        text = txnStepText[item]?.[status]?.title;
      }
    });
    return text;
  }
  return (
    <div className="w-full relative h-[550px]">
      <div className="flex relative justify-center mb-2">
        <button
          onClick={handleOpenExchange}
          className="absolute left-0 top-[25%]"
        >
          <img src="/close.svg" width={12} height={5} alt="img" />
        </button>
        <div className="text-base font-normal text-text-search">Exchange</div>
      </div>
      <div className="flex justify-between items-center">
        <TokenBox
          type="Send"
          amount={amount}
          coinData={fromCoin}
          chainData={fromChain}
        />
        {isError ? (
          <div className="bg-white relative z-10">
            <img src="/failedimg.svg" width={34} height={34} />
          </div>
        ) : (
          <RoundedButton
            classnames={`border w-[65px] h-[65px] md:w-[80px] md:h-[80px] relative z-10    border-border-primary bg-white`}
          >
            <p
              className={` text-sm md:text-lg font-medium text-transparent ${styles.textGrad} bg-clip-text`}
            >
              03.25s
            </p>
          </RoundedButton>
        )}

        <div className="w-[39%] z-0 md:w-[24%] right-[35%] md:right-[38%] absolute h-[1px] bg-background-graybutton "></div>
        <TokenBox
          type="Receive"
          amount={route?.minOutputAmount || ""}
          coinData={toCoin}
          chainData={toChain}
        />
      </div>
      <div className="py-4 mt-4">
        {txnBody.isSuccess && txnBody.data ? (
          txnBody.data?.steps
            ?.filter((item) => {
              return item.stepType !== "claim";
            })
            .map((item, i, arr) => {
              console.log(
                getStepName(item, disableButton ? "process" : "pre"),
                "get"
              );
              return (
                <div className="flex relative items-center mb-4 w-max justify-center gap-x-3">
                  {allSteps?.currentStep < i ? (
                    <div className="w-[18px] rounded-[50%] h-[18px] bg-background-graybutton"></div>
                  ) : allSteps?.currentStep == i ? (
                    disableButton ? (
                      <img
                        src="/arrowprocess.png"
                        width={18}
                        height={18}
                        alt="img"
                      />
                    ) : isError ? (
                      <img
                        src="/failedimg.svg"
                        width={18}
                        height={18}
                        alt="img"
                      />
                    ) : (
                      <img
                        src="/handstep.svg"
                        width={18}
                        height={18}
                        alt="img"
                      />
                    )
                  ) : (
                    <img
                      src="/stepstick.svg"
                      width={18}
                      height={18}
                      alt="img"
                    />
                  )}
                  {i !== arr.length - 1 ? (
                    <div
                      className={`h-[20px] absolute w-[1px] left-[3%] top-[90%] ${
                        allSteps?.currentStep <= i
                          ? "bg-background-graybutton "
                          : "bg-background-secondary"
                      }`}
                    ></div>
                  ) : (
                    <></>
                  )}
                  <span
                    className={`text-lg  ${
                      allSteps?.currentStep == i
                        ? "text-text-search font-medium"
                        : "text-text-steps font-normal"
                    } `}
                  >
                    {getStepName(
                      item,
                      disableButton && allSteps?.currentStep == i
                        ? "process"
                        : "pre"
                    )}
                  </span>
                </div>
              );
            })
        ) : (
          <></>
        )}
      </div>
      {(!fetchStatus.isFetching ||
        fetchStatus.data?.txnStatus == "success" ||
        fetchStatus.data?.txnStatus == "failed") &&
      allSteps.currentStep !== allSteps.steps?.length ? (
        isError ? (
          <div className="absolute border-t pt-3 w-full bottom-0 flex flex-col justify-center items-center">
            <p className="text-lg font-medium text-text-selected mb-2 text-center">
              {" "}
              {getStepName(stepData, "pre")} transaction failed
            </p>
            <button
              disabled={disableButton}
              className="border text-lg flex justify-center items-center gap-x-2 disabled:opacity-60 font-medium   h-[50px] w-[90%] bg-background-form  border-border-primary"
              onClick={handleOpenExchange}
            >
              <p className="bg-gradient-to-l from-[#2CFFE4] text-transparent to-[#A45EFF] bg-clip-text">
                Go Back
              </p>
            </button>
          </div>
        ) : (
          <div className="absolute border-t pt-3 border-border-primary w-full flex flex-col items-center justify-center bottom-0">
            <p className="text-lg font-medium mb-1 text-text-selected">
              {stepTextObj?.title || ""}
            </p>
            <p className="text-sm text-center font-medium mb-4 text-text-primarys">
              {stepTextObj?.description || ""}
            </p>
            <button
              disabled={disableButton}
              className="border text-lg flex justify-center items-center gap-x-2 disabled:opacity-60 font-medium   h-[50px] w-[90%] bg-background-form  border-border-primary"
              onClick={handleStep}
            >
              {disableButton && (
                <img src="/arrowprocess.png" width={18} height={18} alt="img" />
              )}
              <p className="bg-gradient-to-l from-[#2CFFE4] text-transparent to-[#A45EFF] bg-clip-text">
                {stepTextObj?.buttonText || stepData?.stepType || ""}
              </p>
            </button>
          </div>
        )
      ) : txnBody?.isSuccess ? (
        <div className="absolute border-t pt-3 border-border-primary w-full flex flex-col items-center justify-center bottom-0">
          <div className="flex items-center w-full justify-between bg-[#FFFFFF] border border-border-primary shadow-md p-2">
            <div>
              <p className="text-lg bg-gradient-to-l from-[#2CFFE4]  to-[#A45EFF] bg-clip-text font-medium text-transparent">
                Transaction Successful
              </p>
              <p className="text-2xl font-medium text-text-selected">{`${
                route?.minOutputAmount || ""
              } ${toCoin.coinKey}`}</p>
              <p className="text-sm mb-2 font-normal text-text-primary">{`Received on ${toChain.name} chain`}</p>
              <div className="flex items-center gap-x-1">
                <p className="text-sm font-normal text-text-primary">{`Tx id: ${
                  data?.hash
                    ? `${data.hash.substring(0, 5)}...${data.hash.substring(
                        data.hash.length - 5,
                        data.hash.length
                      )}`
                    : ""
                }`}</p>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(data.hash);
                  }}
                >
                  <img src="/copy.svg" />
                </div>
              </div>
            </div>
            <div>
              <img src="/success.png" width={100} height={100} alt="img" />
            </div>
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
});

export default Exchange;
