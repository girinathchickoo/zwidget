import { useState,useEffect } from "react";

export default function QuoteTimer(){
    const [timer, setTimer] = useState(60);
    useEffect(() => {
        let interval = setInterval(() => {
          setTimer((prev) => {
            if (prev == 0) {
              return 60;
            } else {
              return prev - 1;
            }
          });
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      }, []);
    return <p className="text-lg font-medium text-text-primary">
    {`Quote Expires in `}
    <span>{`${timer}s`}</span>
  </p>
}