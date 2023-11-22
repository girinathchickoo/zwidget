import {  useState } from "react";
import SelectWallet from "../SelectWallet";
import useStore from "../../zustand/store";
import { disconnect } from "@wagmi/core";
import { isEmpty } from "lodash";
import WidgetForm from "../WidgetForm";

export default function WidgetContainer() {
  const [showWallet, setShowWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const walletData = useStore((state) => state.walletData);
  const setWalletData = useStore((state) => state.setWalletData);

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
            {!isEmpty(walletData) ? (
              <>
                <div style={{fontSize:'12px'}}>Address:{walletData?.address}</div>
                <div>chain:{walletData?.nativeCurrency?.name}</div>
                <div>Balance:{walletData?.formatted}</div>
                <button
                  onClick={async () => {
                    setWalletData();
                    await disconnect();
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
