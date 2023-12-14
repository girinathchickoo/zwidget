import Icon from "../Icon";
import React, { useState } from "react";
import images from "../../images";
export default function ModeComp({ handleMode, mode }) {
  const [isEditable, setIsEditable] = useState(false);
  const [slippage, setSlippage] = useState("");
  const { info, edit, down, greentick } = images;
  return (
    <div className="mt-4 border-b border-border-mode pb-1 ">
      <p className="text-sm font-medium text-text-form mb-1">Mode</p>
      <div className="flex gap-x-1 w-full">
        <div
          onClick={() => {
            handleMode("Classic");
          }}
          className={`w-1/2 ${
            mode == "Classic" ? "h-[120px]" : "h-max"
          } relative`}
        >
          <div
            className={`border cursor-pointer w-full bg-background-container z-10  rounded-md relative top-0  ${
              mode == "Classic" ? "h-[56px]" : "h-[50px]"
            } flex items-center justify-center gap-x-1 ${
              mode == "Classic"
                ? "border-border-mode border-b-0 rounded-b-none"
                : "border-border-primary"
            }  text-sm font-medium`}
          >
            <div className="absolute right-[-1%] top-[-15%]">
              <img src={info} width={14} height={14} alt="img" />
            </div>
            <div className="bg-background-mode absolute top-[-17%] px-2 text-xs font-normal text-text-primary">
              <p
                className={`${
                  mode == "Classic"
                    ? "bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF] bg-clip-text text-transparent"
                    : ""
                }`}
              >
                Classic
              </p>
            </div>
            <div
              className={`flex gap-x-1 ${
                mode == "Classic" ? "mb-[7px] ml-1" : ""
              }`}
            >
              <span className="text-text-selected font-bold">0.0156 WETH</span>{" "}
              <span className="text-text-primary flex items-center justify-center">
                <Icon /> $ 20.00
              </span>
            </div>
            {mode !== "Classic" ? (
              <div className="absolute bottom-1">
                <img src={down} width={8} height={4} alt="img" />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {mode == "Classic" ? (
            <div className="flex min-h-[86px] absolute border shadow-sm rounded-sm h-max mt-14 top-[-1px] border-border-mode w-[400px] justify-between items-center px-5 py-3">
              <div className=" ">
                <p className="text-sm w-max mb-1 border-b border-border-secondary border-dashed font-medium text-text-primary">
                  Network Gas:
                </p>
                <p className="text-sm font-bold w-max text-center text-text-selected">
                  0.20 Matic
                </p>
              </div>
              <div className=" ">
                <p className="text-sm w-max mb-1 border-b border-border-secondary border-dashed font-medium text-text-primary">
                  Provider Fee:
                </p>
                <p className="text-sm font-bold w-max text-center text-text-selected">
                  0.5 Matic
                </p>
              </div>
              <div className=" ">
                <p className="text-sm w-max mb-1 border-b border-border-secondary border-dashed font-medium text-text-primary">
                  Our Fee:
                </p>
                <p className="text-sm font-bold w-max text-center text-transparent bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF] bg-clip-text">
                  Free
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div
          onClick={() => {
            handleMode("Gasless");
          }}
          className={`w-1/2 ${
            mode == "Gasless" ? "h-[120px]" : "h-max"
          } relative`}
        >
          <div
            className={`border  cursor-pointer w-full bg-background-container z-10  rounded-md relative top-0  ${
              mode == "Gasless" ? "h-[56px]" : "h-[50px]"
            } flex items-center justify-center gap-x-1 ${
              mode == "Gasless"
                ? "border-border-mode border-b-0 rounded-b-none"
                : "border-border-primary"
            }  text-sm font-medium`}
          >
            <div className="absolute right-[-1%] top-[-15%]">
              <img src={info} width={14} height={14} alt="img" />
            </div>
            <div className="bg-background-mode absolute top-[-17%] px-2 text-xs font-normal text-text-primary">
              <p
                className={`${
                  mode == "Gasless"
                    ? "bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF] bg-clip-text text-transparent"
                    : ""
                }`}
              >
                Gasless
              </p>
            </div>
            <div
              className={`flex gap-x-1 ${mode == "Gasless" ? "mb-[7px]" : ""}`}
            >
              <span className="text-text-selected font-bold">0.0156 WETH</span>{" "}
              <span className="text-text-primary flex items-center justify-center">
                <Icon /> $ 20.00
              </span>
            </div>
            {mode !== "Gasless" ? (
              <div className="absolute bottom-1">
                <img src={down} width={8} height={4} alt="img" />
              </div>
            ) : (
              <></>
            )}
          </div>

          {mode == "Gasless" ? (
            <div className="flex absolute border shadow-sm rounded-sm h-max mt-14 gap-x-3  bottom-[-40%] top-[-1px] border-border-mode w-[400px] left-[-100.5%] justify-between items-center px-2 py-3">
              <div className=" ">
                <p className="text-sm w-max mb-1 border-b border-border-secondary border-dashed font-medium text-text-primary">
                  Settlement Fees
                </p>
                <p className="text-sm font-bold w-max text-center text-text-selected">
                  0.156 WETH
                </p>
              </div>
              <div className="text-sm font-normal text-text-primary">
                We submit the transaction & all fees are deducted from the
                output token instead of Native Gas.{" "}
                <span className="bg-gradient-to-r from-[#2CFFE4] to-[#A45EFF] bg-clip-text cursor-pointer text-transparent">
                  Learn More
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex my-4 mt-8 items-center justify-between">
        <div>
          <div className="flex items-center mb-2 gap-x-1">
            <p className="text-sm font-normal  text-text-form">
              Slippage Tolerance
            </p>
            <button
              onClick={() => {
                setIsEditable(true);
              }}
              className="bg-transparent"
            >
              <img src={info} width={14} height={14} alt="img" />
            </button>
          </div>
          <div className="flex items-center gap-x-2">
            <input
              disabled={!isEditable}
              value={slippage}
              onChange={(e) => {
                setSlippage(e.target.value);
              }}
              type="number"
              className="w-[42px] border-b border-dashed pl-1 text-sm font-medium text-text-selected"
              placeholder="0.0%"
            />
            {!isEditable ? (
              <button
                onClick={() => {
                  setIsEditable(true);
                }}
                className="bg-transparent"
              >
                <img src={edit} width={12} height={12} alt="img" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditable(false);
                }}
                className="flex border border-border-secondary rounded-sm py-[3px] p-[2px] justify-center items-center"
              >
                <img src={greentick} width={10} height={10} alt="img" />
              </button>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center mb-2 gap-x-1">
            <p className="text-sm font-normal  text-text-form">Price Impact</p>
            <button className="bg-transparent">
              <img src={info} width={14} height={14} alt="img" />
            </button>
          </div>
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-medium text-text-selected">2.05%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
