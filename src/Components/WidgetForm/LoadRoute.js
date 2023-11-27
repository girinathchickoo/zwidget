import truncate from "../../utils/truncate";
import RoundedButton from "../Button/RoundedButton";
import Step from "./Step";

export default function LoadRoute({ routes, fromChain, handleShowAllRoutes }) {
  return (
    <div className="mt-4">
      {routes.isFetching ? (
        <>
          <div className="flex items-center gap-x-1">
            <p className="text-sm font-normal text-text-search">Route</p>
            <img src="/routeicon.svg" width={13} height={9} alt="img" />
          </div>
          <div className="border gap-x-1 mt-1 flex h-[80px] justify-center text-lg font-normal text-text-loading items-center border-border-primary">
            <img src="/refresh.svg" width={14} height={14} alt="img" />
            Loading Route...
          </div>
        </>
      ) : routes.data ? (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm font-normal  text-text-search">Route</p>
           {routes.data?.routes?.[0]?.length - 1>2?<div
              onClick={handleShowAllRoutes}
              className="text-sm font-normal cursor-pointer hover:opacity-60 bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF] bg-clip-text text-transparent"
            >
              Show All +{routes.data?.routes?.[0]?.length - 1} Routes
            </div>:<></>}
          </div>
          <div className="bg-background-form relative flex flex-col pt-1 pb-6 items-center justify-center border border-border-primary">
            <RoundedButton
              classnames={
                "bg-background-graybutton absolute  right-3 top-2 flex justify-center items-center w-[15px] h-[15px]"
              }
            >
              <img
                src="/downroute.svg"
                width={"12"}
                height={"12"}
                alt="img"
                className="object-cover min-w-[8px] min-h-[8px] "
              />
            </RoundedButton>
            <div className="absolute  gap-x-1 right-2 bottom-1 text-xs font-normal text-text-primary">
              <Step
                step={routes.data?.routes?.[0]?.[0]?.steps?.length}
                provider={routes.data?.routes?.[0]?.[0]?.provider}
              />
            </div>
            <div className="w-[129px] bg-background-container absolute bottom-[-10%] text-transparent text-sm font-normal  h-[22px] rounded-xl border border-border-green1">
              <div className=" w-full h-full bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF]  flex justify-center items-center  bg-clip-text  rounded-xl">
                Recommended
              </div>
            </div>
            <p className="text-3xl font-medium text-text-route">1982.2915</p>
            <div className="flex  items-center gap-x-2">
              <img
                src={fromChain.image}
                className="rounded-[50%]"
                width={18}
                height={18}
              />
              <p className="text-sm font-normal my-1 text-text-primary">
                {fromChain?.name}
              </p>
            </div>
            <div className="text-sm flex items-center gap-x-2 font-medium text-text-primary">
              <div className="flex items-center gap-x-1">
                <div className="flex flex-col  justify-center items-center w-max gap-y-1">
                  <p className="leading-[0px] p-0">~</p>
                  <p className="leading-[0px] p-0">-</p>
                </div>
                <p>$ 1920.68</p>
              </div>
              <div className="flex items-center gap-x-1">
                <img src="/gas.svg" width={14} height={14} alt="img" />
                <p>
                  {truncate(
                    routes.data?.routes?.[0]?.[0].fee?.[1]?.amountInEther,
                    4
                  ) || 0}
                </p>
              </div>
              <div className="flex items-center gap-x-1">
                <img src="/time.svg" width={14} height={14} alt="img" />
                <p>{`${routes.data?.routes?.[0]?.[0]?.deadline}min`}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
