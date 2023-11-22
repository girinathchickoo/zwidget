import React, { useEffect, useState } from "react";
import SelectChain from "../SelectChain";
import { isEmpty } from "lodash";
import useStore from "../../zustand/store";
import { sendTransaction } from "@wagmi/core";
import { parseEther } from "viem";
import prepareTx from "./prepareTxn";
import { useAccount } from "wagmi";
import { useSendTransaction } from "wagmi";
import Comp from "../Test"
export default function WidgetForm({ selectedWallet, handleShowWallet }) {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState({ chain: "", coin: "" });
  const { isConnected } = useAccount();
  const [to, setTo] = useState({ chain: "", coin: "" });
  const [showExchangeList, setShowExchangeList] = useState();
  const walletData = useStore((state) => state.walletData);
  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    to: "0x1b1E919E51a1592Dce70a4FD74107941109B8235",
    value: (Number(amount) * 1e18).toString(),
  });
  useEffect(()=>{
    fetch("https://api.zelta.io/quotes",{
      method:"get",
      headers:{
        authorization:'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJnaXJpbmF0aGdpcmkyNEBnbWFpbC5jb20iLCJhdXRoIjoiQURNSU4sRVhFQ1VUSVZFLE1BUktFVElORyxTVEFGRixTVVBFUkFETUlOLFVTRVIiLCJleHAiOjE3MDA3NTkwMjF9.pcnSzmcGD4oOSBSDjQA0Xh0oqae2AuPhVRuSgar0rzzOq4Y21QPPGLO9kMKIqIKPf3gJyEolSBcK9MRt84C5-g'
      }
    }).then(res=>res.json()).then(res=>{console.log(res)})
  },[])
  function handleResetList() {
    setShowExchangeList();
  }
  function handleChain(data) {
    if (showExchangeList == "from") {
      setFrom({ ...from, ...data });
    } else if (showExchangeList == "to") {
      setTo({ ...to, ...data });
    }
  }
  function callTransaction() {
    prepareTx(walletData).then((res) => console.log(res, "resp"));
  }
  useEffect(() => {
    if (
      from.chain?.length &&
      to.chain.length &&
      from.coin.length &&
      to.coin.length
    ) {
      callTransaction();
    }
  }, [from, to]);
  async function handleSubmit() {
    sendTransaction();
  }
  return (
    <div>
      {!showExchangeList ? (
        <>
          {" "}
          <div
            onClick={() => {
              setShowExchangeList("from");
            }}
          >
            <p>From</p>
            <p>Select Chain and Token</p>
            <p>
              Coin:{from.coin} Chain:{from.chain}
            </p>
          </div>
          <div
            onClick={() => {
              setShowExchangeList("to");
            }}
          >
            <p>To</p>
            <p>Select Chain and Token</p>
            <p>
              Coin:{to.coin} Chain:{to.chain}
            </p>
          </div>
          <div>
            <p>Amount</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>
          <button
            onClick={() => {
              !isConnected
                ? handleShowWallet(true)
                : handleSubmit(selectedWallet);
            }}
          >
            {isConnected ? "Exchange" : "Connect Wallet"}
          </button>
        </>
      ) : (
        <SelectChain
          data={showExchangeList == "from" ? from : to}
          setData={handleChain}
          handleReset={handleResetList}
        />
      )}
    </div>
  );
}
