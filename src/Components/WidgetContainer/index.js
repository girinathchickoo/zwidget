import { useEffect, useState } from "react";
import SelectWallet from "../SelectWallet";
import useStore from "../../zustand/store";
import { isEmpty } from "lodash";
import WidgetForm from "../WidgetForm";
import { useAccount, useBalance, useDisconnect, useNetwork } from "wagmi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import truncate from "../../utils/truncate";
import images from "../../images";
export default function WidgetContainer() {
  const [showWallet, setShowWallet] = useState(false);
  const setWalletData = useStore((state) => state.setWalletData);
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { down } = images;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data } = useBalance({ address });
  const { disconnect } = useDisconnect();
  function handleShowWallet(val) {
    setShowWallet(!showWallet);
  }
  useEffect(() => {
    setWalletData(chain);
  }, [chain]);

  let walletData = {
    address,
    chain,
    data,
  };
  return (
    <div
      style={{
        width: "443px",
        minHeight: "400px",
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "20px",
      }}
      className="md:w-[443px] md:min-h-[400px] w-full md:m-auto max-w-[98%] mx-auto   md:max-w-[443px]  "
    >
      {!showWallet ? (
        <>
          <div className="w-full flex justify-end">
            {isConnected ? (
              <>
                <Button
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  id="basic-button"
                  style={{ fontSize: "12px" }}
                  className="gap-x-2"
                >
                  <p className="text-text-primary">{address}</p>
                  <img src={down} />
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  id="basic-button"
                >
                  <MenuItem onClick={handleClose}>
                    chain:{chain.network}
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    Balance:{truncate(data?.formatted, 4)}
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <button
                      onClick={async () => {
                        setWalletData();
                        disconnect();
                      }}
                    >
                      Disconnect
                    </button>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            <WidgetForm
              selectedWallet={walletData}
              handleShowWallet={handleShowWallet}
            />
          </div>
        </>
      ) : (
        <SelectWallet handleShowWallet={handleShowWallet} />
      )}
    </div>
  );
}
