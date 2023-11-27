export default function Step({ step, provider }) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col justify-center items-center">
        <svg
          width="13"
          height="10"
          viewBox="0 0 15 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.8284 0.481652L1.04542 4.87669C0.519522 5.27637 0.518732 6.06708 1.04383 6.46781L6.95036 10.9754C7.31074 11.2504 7.81105 11.2486 8.16943 10.971L13.6419 6.73177C14.1471 6.34042 14.1606 5.58212 13.6697 5.173L8.07367 0.5096C7.71577 0.211345 7.19932 0.199753 6.8284 0.481652Z"
            fill="#808080"
          />
        </svg>
        <svg
          width="16"
          height="4"
          viewBox="0 0 16 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.42188 0.490234L7.16609 4.64975C7.86752 5.15768 8.81616 5.15645 9.51628 4.64671L15.1433 0.549865"
            stroke="#808080"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      {`${step} step ${provider ? "via" + " " + provider : ""}`}
    </div>
  );
}
