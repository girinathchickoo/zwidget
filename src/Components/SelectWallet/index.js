import React from "react";
import MetamaskWallet from "../MetamaskWallet";
import WalletConnect from "../WalletConnect";
import BrowserWallet from "../BowserWallet";
export default function SelectWallet({ handleShowWallet, handleSetWallet }) {
  const walletList = [
    <BrowserWallet
      handleShowWallet={handleShowWallet}
      handleSetWallet={handleSetWallet}
    />,
    <MetamaskWallet
      handleShowWallet={handleShowWallet}
      handleSetWallet={handleSetWallet}
    />,
    <WalletConnect
      handleShowWallet={handleShowWallet}
      handleSetWallet={handleSetWallet}
    />,
  ];
  return walletList.map((item, i) => {
    return (
      <div
        style={{ cursor: "pointer" }}
        key={i}
      >
        {item}
      </div>
    );
  });
}
