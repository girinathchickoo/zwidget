export default function getIsInstalled(wallet) {
  switch (wallet) {
    case "metamask":
      if (window?.ethereum?.isMetaMask) {
        return true;
      } else {
        return false;
      }
    case "zerion":
      if (window?.ethereum?.isZerion) {
        return true;
      } else {
        return false;
      }
    case "coinbasewallet":
      if (window?.coinbaseWalletExtension) {
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
}
