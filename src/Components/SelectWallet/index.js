import { connect } from "@wagmi/core";
import React, { useState } from "react";
import { useConnect, useDisconnect } from "wagmi";
import getIsInstalled from "./getisInstalled";
export default function SelectWallet({ handleShowWallet, handleSetWallet }) {
  const { connectAsync, data, connectors } = useConnect();
  console.log(data);
  const [errorMsg, setErrorMsg] = useState("");
  const { disconnect } = useDisconnect();
  async function handleConnect(connector) {
    try {
      let result = await connectAsync({ connector });
      handleSetWallet("metamask");
      handleShowWallet(false);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err.details);
    }
  }

  return (
    <div>
      {connectors.map((item, i) => {
        console.log(item);
        return (
          <div>
            <button
              onClick={() => {
                handleConnect(item);
              }}
              style={{ cursor: "pointer" }}
              key={i}
              className={`${
                item.ready ? "" : "opacity-50 pointer-events-none"
              } flex items-center w-full justify-between`}
            >
              <p>{item.name}</p>
            </button>
          </div>
        );
      })}
      <p className="text-text-error">{errorMsg}</p>
    </div>
  );
}
