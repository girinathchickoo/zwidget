import { useState, useEffect } from "react";

export default function QuoteTimer({ quoteTimer }) {
  return (
    <p className="text-lg font-medium text-text-primary">
      {`Quote Expires in `}
      <span>{`${quoteTimer}s`}</span>
    </p>
  );
}
