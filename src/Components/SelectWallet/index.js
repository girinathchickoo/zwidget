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

  const walletIcons = {
    injected: "/injectedicon.svg",
    metaMask: "/metamaskicon.svg",
    coinbaseWallet: "/coinbaseicon.svg",
    walletConnect: "/walletconnecticon.svg",
  };

  return (
    <div>
      <div className="flex relative justify-center mb-2">
        <button
          onClick={handleShowWallet}
          className="absolute left-0 top-[25%]"
        >
          <img src="/backbutton.svg" width={12} height={5} alt="img" />
        </button>
        <div className="text-base font-normal text-text-search">
          Connect Wallet
        </div>
        <button
          onClick={handleShowWallet}
          className="absolute right-0 top-[25%]"
        >
          <img src="/close.svg" width={12} height={5} alt="img" />
        </button>
      </div>
      <div className="flex justify-center mt-4 flex-wrap gap-4">
        {connectors.map((item, i) => {
          console.log(item);
          return (
            <div
              key={i}
              onClick={() => {
                handleConnect(item);
              }}
              style={{ cursor: "pointer" }}
              className={`w-[179px] flex gap-2 flex-col justify-center items-center h-[150px] relative border rounded-md border-border-connect ${
                item.ready ? "" : "opacity-50 pointer-events-none"
              }`}
            >
              {getIsInstalled(item.id.toLowerCase()) ? (
                <div className="absolute top-1 left-2">
                  <img
                    src="/installedicon.svg"
                    width={75}
                    height={14}
                    alt="img"
                  />
                </div>
              ) : (
                <></>
              )}
              <img
                src={walletIcons[item.id]}
                width={70}
                height={70}
                alt="img"
              />
              <p className="text-sm w-max font-medium text-text-mode">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-text-error text-sm font-normal text-center mt-2">
        {errorMsg}
      </p>
    </div>
  );
}
