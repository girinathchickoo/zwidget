import { useState } from "react";
import SelectWallet from "../SelectWallet";
import useStore from "../../zustand/store";
import { isEmpty } from "lodash";
import WidgetForm from "../WidgetForm";
import { useAccount, useBalance, useDisconnect,useNetwork } from "wagmi";

export default function WidgetContainer() {
  const [showWallet, setShowWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const walletData = useStore((state) => state.walletData);
  const setWalletData = useStore((state) => state.setWalletData);
  const {address, isConnected } = useAccount();
  const { chain, chains } = useNetwork()
  const {data}=useBalance({address})
  const {disconnect}=useDisconnect()
  function handleShowWallet(val) {
    setShowWallet(val);
  }

  function handleSetWallet(wallet) {
    setSelectedWallet(wallet);
  }

  return (
    <div
      style={{
        width: "442px",
        height: "550px",
        background: "#0F0F0F",
        margin: "auto",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      {!showWallet ? (
        <>
          <div>
            {isConnected ? (
              <>
                <div style={{ fontSize: "12px" }}>
                  Address:{address}
                </div>
                <div>chain:{chain.network}</div>
                <div>Balance:{data?.formatted}</div>
                <button
                  onClick={async () => {
                    setWalletData();
                     disconnect();
                  }}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            <WidgetForm
              selectedWallet={selectedWallet}
              handleShowWallet={handleShowWallet}
            />
          </div>
        </>
      ) : (
        <SelectWallet
          handleShowWallet={handleShowWallet}
          handleSetWallet={handleSetWallet}
        />
      )}
    </div>
  );
}
