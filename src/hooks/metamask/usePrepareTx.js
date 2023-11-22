import { prepareSendTransaction } from "@wagmi/core";
import { useState } from "react";

export default function usePrepareTx() {
  async function prepareTx() {
    try {
      const request = await prepareSendTransaction({
        to: "moxey.eth",
        value: parseEther("1"),
      });
      return request;
    } catch (err) {
      console.log(err);
    }
  }

  return prepareTx;
}
