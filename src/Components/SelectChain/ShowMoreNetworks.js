import { useState } from "react";

export default function ShowMoreNetworks({
  data,
  handleBack,
  handleSetChainData,
  network,
  handleClosePopup
}) {
  const [networkData, setNetworkData] = useState(data);
  const [value, setValue] = useState("");
  return (
    <div>
      <div className="flex relative justify-center mb-2">
        <button
          onClick={() => {
            handleBack();
          }}
          className="absolute left-0 top-[25%]"
        >
          <img src="/backbutton.svg" width={12} height={5} alt="img" />
        </button>
        <div className="text-base font-normal text-text-search">Network</div>
      </div>
      <div className="relative">
      <input
        type={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={`text-sm px-2 w-full h-[34px] ${!value.length?"border border-border-primary":"border border-border-green"} rounded-[5px] font-normal text-text-search`}
        placeholder="Search Network"
      />
      <img className="absolute right-2 bg-background-container top-2" width={16} height={16} src="/search.svg" alt="img"/>
      </div>
      <div className="h-[500px] mt-3 overflow-y-auto">
        {networkData
          .slice(9, networkData.length)
          .filter((item) => {
            return item.name.toLowerCase().includes(value.toLowerCase());
          })
          .map((item, i) => {
            return (
              <div
                onClick={() => {
                    let newObj={...network,  chain:item.name, ...item }
                  handleBack(item);
                  handleSetChainData(newObj);
                }}
                className="py-2 cursor-pointer border-b flex items-center gap-x-3 border-border-primary text-sm font-normal text-text-primary"
                key={i}
              >
                <img
                  src={item.image}
                  className="rounded-[50%]"
                  width={25}
                  height={25}
                  alt="img"
                />{" "}
                <p>{item.name}</p>
                {network.chain === item.name ? (
                  <img src="/tick.png" width={10} height={10} alt="img" />
                ) : (
                  <></>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
