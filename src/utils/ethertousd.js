export default function ethertousd(val, decimal) {
  console.log(val, decimal, "ethertousd");
  console.log(val / Math.pow(10, decimal), "ethertousd");
  return val / Math.pow(10, decimal);
}
