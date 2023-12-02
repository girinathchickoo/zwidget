import TokenBox from "./TokenBox";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import controllers from "../../Actions/Controllers";
import { useSendTransaction, usePrepareSendTransaction } from "wagmi";
import { isEmpty } from "lodash";
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
  const [allSteps, setAllSteps] = useState([]);
  const [showErrorMsg, setShowErrorMsg] = useState("");
  const [stepTextObj, setStepTextObj] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const prepare = usePrepareSendTransaction({
    to: toCoin.address,
    value: 0,
  });
  const { data, isLoading, isError, isSuccess, sendTransaction } =
    useSendTransaction({
      value: 0,
      ...prepare,
      ...txnEvm,
    });
  const nextTx = useMutation(
    "nexttx",
    async ({ routeId, id }) => {
      let res = await controllers.fetchNextTx(routeId, id);
      return await res.json();
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log(data, "evmdata");
        setDisableButton(false);
        setTxnEvm(data.txnEvm);
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
        setAllSteps({ steps: data?.steps, currentStep: 0 });
        const {
          routeId,
          steps: [item],
        } = data;
        handleStepText(item, "pre");
        setStepData(item);
      },
      onError: () => {},
    }
  );
  const fetchStatus = useMutation(
    "status",
    async ({ routeId, stepId, txnHash }) => {
      let res = await controllers.fetchStatus(routeId, stepId, txnHash);
      return res.json();
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data.txnStatus == "success" || data.txnStatus == "failed") {
          clearInterval(interval);
          handleStepText(allSteps.steps[allSteps.currentStep + 1], "pre");
          setStepData(allSteps.steps[allSteps.currentStep + 1]);
          setAllSteps({ ...allSteps, currentStep: allSteps.currentStep + 1 });
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
  async function callNextTx() {
    nextTx.mutateAsync({ id: stepData?.id, routeId: txnBody.data?.routeId });
  }
  useEffect(() => {
    if (!isEmpty(stepData)) {
      callNextTx();
    }
  }, [stepData]);
  console.log(stepData, "stepsData");
  useEffect(() => {
    if (!isError && data) {
      console.log("call status");
      interval = setInterval(() => {
        callStatus();
      }, 5000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isError, data]);
  async function handleStep() {
    setDisableButton(true);
    sendTransaction();
    handleStepText(allSteps.steps[allSteps.currentStep], "process");
  }
  console.log(stepData, "stepData");

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
        <TokenBox
          type="Receive"
          amount={route?.minOutputAmount || ""}
          coinData={toCoin}
          chainData={toChain}
        />
      </div>
      <div className="py-4 mt-4">
        {txnBody.isSuccess && txnBody.data ? (
          txnBody.data?.steps?.map((item, i, arr) => {
            return (
              <div className="flex relative items-center mb-4 w-max justify-center gap-x-3">
                {allSteps?.currentStep <= i ? (
                  <div className="w-[18px] rounded-[50%] h-[18px] bg-background-graybutton"></div>
                ) : (
                  <img src="/stepstick.svg" width={18} height={18} alt="img" />
                )}
                {i !== arr.length - 1 ? (
                  <div
                    className={`h-[20px] absolute w-[1px] left-[9%] top-[90%] ${
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
                  {item.stepType}
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
        <div className="absolute border-t pt-3 border-border-primary w-full flex flex-col items-center justify-center bottom-0">
          <p className="text-lg font-medium mb-1 text-text-selected">
            {stepTextObj?.title || ""}
          </p>
          <p className="text-sm font-medium mb-4 text-text-primarys">
            {stepTextObj?.description || ""}
          </p>
          <button
            disabled={disableButton}
            className="border text-lg disabled:opacity-60 font-medium   h-[50px] w-[90%] bg-background-form  border-border-primary"
            onClick={handleStep}
          >
            <p className="bg-gradient-to-l from-[#2CFFE4] text-transparent to-[#A45EFF] bg-clip-text">
              {stepTextObj?.buttonText || stepData?.stepType || ""}
            </p>
          </button>
        </div>
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
