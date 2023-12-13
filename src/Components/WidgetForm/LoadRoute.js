import truncate from "../../utils/truncate";
import RoundedButton from "../Button/RoundedButton";
import Step from "./Step";
import { isEmpty } from "lodash";

export default function LoadRoute({
  routes,
  fromChain,
  handleShowAllRoutes,
  routesData,
  price,
}) {
  console.log(routes, "routes");
  const { data } = routes;

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
      ) : !isEmpty(routesData) ? (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-1">
              <p className="text-sm font-normal text-text-search">Route</p>
              <img src="/routeicon.svg" width={13} height={9} alt="img" />
            </div>
            {routes.data?.quotes?.[0]?.length - 1 > 0 ? (
              <div
                onClick={handleShowAllRoutes}
                className="text-sm font-normal cursor-pointer hover:opacity-60 bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF] bg-clip-text text-transparent"
              >
                Show All +{routes.data?.quotes?.[0]?.length - 1} Routes
              </div>
            ) : (
              <></>
            )}
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
                step={routesData?.steps?.length}
                provider={routesData?.provider}
              />
            </div>
            {data?.quotes?.[0]?.[0].minOutputAmount ==
            routesData.minOutputAmount ? (
              <div className="w-[129px] bg-background-container absolute bottom-[-10%] text-transparent text-sm font-normal  h-[22px] rounded-xl border border-border-green1">
                <div className=" w-full h-full bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF]  flex justify-center items-center  bg-clip-text  rounded-xl">
                  Recommended
                </div>
              </div>
            ) : (
              <></>
            )}
            <p className="text-3xl font-medium text-text-route">
              {routesData?.minOutputAmount}{" "}
              {data?.quotes?.[0]?.[0].to?.symbol || ""}
            </p>
            <div className="flex  items-center gap-x-2">
              <img
                src={fromChain.image}
                className="rounded-[50%]"
                width={18}
                height={18}
              />
              <p className="text-sm font-normal my-1 text-text-primary">
                On{" "}
                {routesData?.protocolsUsed.map((item, i, arr) => {
                  return i == arr.length - 1 ? item : `${item + " & "}`;
                })}{" "}
                via {routesData?.provider || ""}
              </p>
            </div>
            <div className="text-sm flex items-center gap-x-2 font-medium text-text-primary">
              <div className="flex items-center gap-x-1">
                <div className="flex flex-col  justify-center items-center w-max gap-y-1">
                  <p className="leading-[0px] p-0">~</p>
                  <p className="leading-[0px] p-0">-</p>
                </div>
                <p>$ {truncate(price, 2)}</p>
              </div>
              <div className="flex items-center gap-x-1">
                <img src="/gas.svg" width={14} height={14} alt="img" />
                <p>$ {truncate(routesData?.fee?.[1]?.amountInUSD, 4) || 0}</p>
              </div>
              <div className="flex items-center gap-x-1">
                <img src="/time.svg" width={14} height={14} alt="img" />
                <p>{`${routesData?.deadline}min`}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        routes.isSuccess && (
          <div className="bg-background-form text-text-loading flrx justify-center items-center h-[80px] relative flex flex-col  border border-border-primary">
            No Routes Available
          </div>
        )
      )}
    </div>
  );
}
