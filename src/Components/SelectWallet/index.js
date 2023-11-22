import React from "react";
import { useConnect, useDisconnect } from "wagmi";
export default function SelectWallet({ handleShowWallet, handleSetWallet }) {
  const { connectAsync, data, connectors } = useConnect();
  console.log(data);
  const { disconnect } = useDisconnect();
  async function handleConnect(connector) {
    let result = await connectAsync({ connector });
    handleSetWallet("metamask");
    handleShowWallet(false);
  }
  return connectors.map((item, i) => {
    return (
      <>
        <button
          onClick={() => {
            handleConnect(item);
          }}
          style={{ cursor: "pointer" }}
          key={i}
        >
          {item.name}
        </button>
      </>
    );
  });
}
