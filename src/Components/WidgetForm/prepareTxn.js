import { parseEther } from "viem";
import { prepareSendTransaction } from "@wagmi/core";

 export default async function prepareTx(connector,walletData) {
    console.log(connector)
    try {
        const coonect=connector
      const request = await prepareSendTransaction({
        to: "polygon.mat",
        value: parseEther("1"),
        account:walletData?.address,
        chainId:walletData?.id
      });
      return request;
    } catch (err) {
      console.log(err);
    }
  }
