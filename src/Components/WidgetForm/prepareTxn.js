import { parseEther } from "viem";
import { prepareSendTransaction } from "@wagmi/core";

export default async function prepareTx(walletData) {
  try {
    const request = await prepareSendTransaction({
      to: "moxey.eth",
      value: "1",
      account: walletData?.address,
      chainId: walletData?.id,
    });
    return request;
  } catch (err) {
    console.log(err);
  }
}
