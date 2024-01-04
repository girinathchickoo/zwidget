export default function truncate(number, decimal) {
  console.log(number, decimal, "truncate");
  let pow = Math.pow(10, decimal);

  console.log(Math.floor(number * pow) / pow, "truncate1");
  return Math.floor(number * pow) / pow;
}
