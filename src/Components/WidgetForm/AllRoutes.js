import truncate from "../../utils/truncate";
import RoundedButton from "../Button/RoundedButton";
import Step from "./Step";
import images from "../../images";
import ethertousd from "../../utils/ethertousd";
export default function AllRoutes({
  fromChain,
  routes,
  handleShowAllRoutes,
  handleRoutesData,
  convertVal,
}) {
  const { time, gas, downroute, routeicon, backbutton } = images;
  return (
    <div>
      <div className="flex relative justify-center mb-2">
        <button
          onClick={() => {
            handleShowAllRoutes();
          }}
          className="absolute left-0 top-[25%]"
        >
          <img src={backbutton} width={12} height={5} alt="img" />
        </button>
        <div className="text-base font-normal text-text-search">All Routes</div>
      </div>
      <div>
        <div className="w-full flex my-2  text-sm  font-normal text-text-primary justify-start  gap-x-1">
          Routes
          <img src={routeicon} width={13} height={9} alt="img" />
        </div>
        <div className="h-[500px] overflow-y-auto">
          {routes.data?.quotes?.map((item, i) => {
            let gasObj = item?.fee?.find((item) => item.type == "network");
            return (
              <div
                onClick={() => {
                  handleRoutesData(item);
                  handleShowAllRoutes();
                }}
                className="mb-4"
              >
                <div
                  className={`bg-background-form cursor-pointer  flex flex-col items-center px-6 relative  pt-3 pb-6  ${
                    i == 0 ? "border" : "bodrder-0"
                  } border-border-primary`}
                >
                  <RoundedButton
                    classnames={
                      "bg-background-graybutton absolute  right-2 top-1 flex justify-center items-center w-[15px] h-[15px]"
                    }
                  >
                    <img
                      src={downroute}
                      width={"12"}
                      height={"12"}
                      alt="img"
                      className="object-cover min-w-[8px] min-h-[8px] "
                    />
                  </RoundedButton>

                  {i == 0 ? (
                    <div className="w-[129px] bg-background-container absolute bottom-[-10%] text-transparent text-sm font-normal  h-[22px] rounded-xl border border-border-green1">
                      <div className=" w-full h-full bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF]  flex justify-center items-center  bg-clip-text  rounded-xl">
                        Recommended
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="flex w-full  justify-between items-center">
                    <p className="text-lg w-[40%] break-words font-medium text-text-route">
                      {truncate(
                        Number(
                          item.minOutputAmount || item.outputAmountDisplay
                        ),
                        4
                      )}
                    </p>
                    <div className="flex  w-[60%] items-center gap-x-2">
                      <img
                        src={fromChain.image}
                        className="rounded-[50%]"
                        width={18}
                        height={18}
                      />
                      <p className="text-sm font-normal my-1 text-text-primary">
                        {item?.protocolsUsed.map((item, i, arr) => {
                          return i == arr.length - 1 ? item : `${item + " & "}`;
                        })}{" "}
                        via {item?.provider || ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div className="flex w-[40%] items-center gap-x-1">
                      <div className="flex flex-col  justify-center items-center w-max gap-y-1">
                        <p className="leading-[0px] p-0">~</p>
                        <p className="leading-[0px] p-0">-</p>
                      </div>
                      <p className="text-text-primary">
                        ${" "}
                        {truncate(
                          Number(
                            item.minOutputAmount || item.outputAmountDisplay
                          ) * convertVal,
                          2
                        )}
                      </p>
                    </div>
                    <div className="text-sm w-[60%] flex items-center gap-x-2 font-medium text-text-primary">
                      <div className="flex items-center gap-x-1">
                        <img src={gas} width={14} height={14} alt="img" />
                        <p>
                          ${" "}
                          {truncate(
                            item.fee?.[1]?.amountInUSD ||
                              ethertousd(
                                gasObj?.amountInEther,
                                gasObj?.token?.decimals
                              ) ||
                              0,
                            4
                          ) || 0}
                        </p>
                      </div>
                      <Step step={item.steps.length} />

                      <div className="flex items-center gap-x-1">
                        <img src={time} width={14} height={14} alt="img" />
                        <p>{`${Math.floor(
                          (item.estimatedTimeInSeconds || 60) / 60
                        )}min`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
