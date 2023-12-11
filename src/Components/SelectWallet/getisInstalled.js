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
    case "coinbase wallet":
      if (window?.coinbaseWallet) {
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
}
