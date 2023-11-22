import React, { useEffect, useState } from "react";
import SelectChain from "../SelectChain";
import { isEmpty } from "lodash";
import useStore from "../../zustand/store";
import prepareTx from "./prepareTxn";
export default function WidgetForm({ selectedWallet, handleShowWallet }) {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState({ chain: "", coin: "" });
  const [to, setTo] = useState({ chain: "", coin: "" });
  const [showExchangeList, setShowExchangeList] = useState();
  const walletData = useStore((state) => state.walletData);
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
  }, [from,to]);
  function handleSubmit() {}
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
              isEmpty(walletData)
                ? handleShowWallet(true)
                : handleSubmit(selectedWallet);
            }}
          >
            {!isEmpty(walletData) ? "Exchange" : "Connect Wallet"}
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
