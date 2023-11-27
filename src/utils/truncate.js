

export default function truncate(number,decimal){
    let pow = Math.pow(10, decimal);

    return Math.floor(number * pow) / pow;
}