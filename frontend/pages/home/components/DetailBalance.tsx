import { t } from "i18next";

import { toFullDecimal } from "@/utils";
import { DrawerOption, DrawerOptionEnum, IconTypeEnum } from "@/const";
import ArrowTopRightIcon from "@assets/svg/files/arrow-top-right-icon.svg";
import ArrowBottomLeftIcon from "@assets/svg/files/arrow-bottom-left-icon.svg";

import { DrawerHook } from "../hooks/drawerHook";
import { GeneralHook } from "../hooks/generalHook";
import { Fragment } from "react";
import { UseTransaction } from "../hooks/useTransaction";
import DrawerTransaction from "./transaction/Transaction";
import DrawerAction from "./DrawerAction";
import DrawerSend from "./DrawerSend";
import DrawerReceive from "./DrawerReceive";
import DrawerWrap from "./DrawerWrap";

export default function DetailsBalance() {
  const { getAssetIcon, selectedAsset, selectedAccount } = GeneralHook();
  const { drawerOption, setDrawerOption, drawerOpen, setDrawerOpen } = DrawerHook();
  const { selectedTransaction } = UseTransaction();

  return (
    <Fragment>
      <div className="flex flex-row justify-between items-center w-full h-[4.75rem] bg-TransactionHeaderColorLight dark:bg-TransactionHeaderColor rounded-md">
        <div className="flex flex-col justify-center items-start bg-acceptButtonColor w-[17rem] h-full rounded-l-md p-4 text-PrimaryColorLight">
          <div className="flex flex-row items-center justify-between w-full gap-1">
            {getAssetIcon(IconTypeEnum.Enum.HEADER, selectedAsset?.tokenSymbol, selectedAsset?.logo)}
            <div className="flex flex-col items-end justify-center">
              <p className="font-semibold text-[1.15rem] text-right">{`${toFullDecimal(
                selectedAccount?.amount || "0",
                selectedAccount?.decimal || 8,
                Number(selectedAsset?.shortDecimal),
              )} ${selectedAsset?.symbol}`}</p>
              <p className="font-semibold text-md">{`$${selectedAccount?.currency_amount}`}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-around items-center h-full w-[calc(100%-17rem)] text-ThirdTextColorLight dark:text-ThirdTextColor">
          <div className="flex flex-col items-center justify-center w-1/3 gap-1">
            <div
              className="flex flex-row items-center justify-center rounded-md cursor-pointer w-7 h-7 bg-acceptButtonColor"
              onClick={() => {
                setDrawer(DrawerOptionEnum.Enum.SEND);
              }}
            >
              <img src={ArrowTopRightIcon} className="w-3 h-3" alt="send-icon" />
            </div>
            <p className="text-md">{t("send")}</p>
          </div>
          <div className="flex flex-col items-center justify-center w-1/3 gap-1">
            <div
              className="flex flex-row items-center justify-center rounded-md cursor-pointer w-7 h-7 bg-acceptButtonColor"
              onClick={() => {
                setDrawer(DrawerOptionEnum.Enum.RECEIVE);
              }}
            >
              <img src={ArrowBottomLeftIcon} className="w-3 h-3" alt="receive-icon" />
            </div>
            <p className="text-md">{t("receive")}</p>
          </div>
        </div>
      </div>

      <div
        id="right-drower"
        className={`h-[calc(100%-4.5rem)] fixed z-[999] top-4.5rem w-[28rem] overflow-x-hidden transition-{right} duration-500 ${
          drawerOpen ? "!right-0" : "right-[-30rem]"
        }`}
      >
        {selectedTransaction ? (
          <DrawerTransaction setDrawerOpen={setDrawerOpen} />
        ) : (
          <div className="flex flex-col items-center justify-start w-full h-full gap-5 px-6 pt-8 bg-PrimaryColorLight dark:bg-PrimaryColor">
            <DrawerAction drawerOption={drawerOption} setDrawerOption={setDrawerOption} setDrawerOpen={setDrawerOpen}>
              {drawerOption === DrawerOptionEnum.Enum.SEND && (
                <DrawerSend drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
              )}
              {drawerOption === DrawerOptionEnum.Enum.RECEIVE && <DrawerReceive />}
              {drawerOption === DrawerOptionEnum.Enum.WRAP && <DrawerWrap />}
            </DrawerAction>
          </div>
        )}
      </div>
    </Fragment>
  );

  function setDrawer(drawer: DrawerOption) {
    setDrawerOption(drawer);
    setTimeout(() => {
      setDrawerOpen(true);
    }, 150);
  }
}
