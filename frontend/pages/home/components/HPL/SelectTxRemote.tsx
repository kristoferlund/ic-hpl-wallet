// svgs
import ChevIcon from "@assets/svg/files/chev-icon.svg";
import SearchIcon from "@assets/svg/files/icon-search.svg";
//
import { ChangeEvent, Fragment, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CustomInput } from "@components/Input";
import { HPLAsset, HplContact, HplRemote, HplTxUser } from "@redux/models/AccountModels";
import { clsx } from "clsx";
import { getContactColor, getInitialFromName } from "@/utils";
import { useTranslation } from "react-i18next";

interface SelectTxRemoteProps {
  select: HplTxUser;
  setSelect(sel: HplTxUser): void;
  manual: boolean;
  getAssetLogo(id: string): string;
  getFtFromSub(id: string): HPLAsset;
  hplContacts: HplContact[];
}

const SelectTxRemote = ({
  manual,
  select,
  setSelect,
  getAssetLogo,
  getFtFromSub,
  hplContacts,
}: SelectTxRemoteProps) => {
  const { t } = useTranslation();
  const [subsOpen, setSubsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  return (
    <Fragment>
      {manual ? (
        <div className="flex flex-col justify-start items-start w-full gap-2">
          <CustomInput
            intent={"secondary"}
            placeholder={"Principal"}
            compOutClass="mb-1"
            value={select.principal}
            onChange={onChangePrincipal}
            sizeInput="small"
            border={"secondary"}
          />
          <CustomInput
            compOutClass="!w-1/3"
            intent={"secondary"}
            placeholder={t("index")}
            value={select.vIdx}
            onChange={onChangeIdx}
            sizeInput="small"
            border={"secondary"}
          />
        </div>
      ) : (
        <DropdownMenu.Root
          open={subsOpen}
          onOpenChange={(e: boolean) => {
            setSubsOpen(e);
          }}
        >
          <DropdownMenu.Trigger asChild>
            <div
              className={clsx(
                "flex justify-start items-start",
                "border-BorderColorLight dark:border-BorderColor",
                "cursor-pointer",
                "!w-full",
                "pr-0",
              )}
            >
              <div className="flex flex-row justify-start items-center w-full px-2 py-1 border border-BorderColorTwoLight dark:border-BorderColorTwo rounded-md bg-SecondaryColorLight dark:bg-SecondaryColor">
                {!select.remote ? (
                  <div className="flex flex-row justify-between items-center w-full">
                    <p className="opacity-60">{t("select.remote")}</p>
                    <img
                      src={ChevIcon}
                      style={{ width: "2rem", height: "2rem" }}
                      alt="chevron-icon"
                      className={`${subsOpen ? "rotate-90" : ""}`}
                    />
                  </div>
                ) : (
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="p-1 flex flex-row justify-start items-center w-full gap-4 text-sm">
                      <div
                        className={`flex justify-center items-center !min-w-[2rem] w-8 h-8 rounded-md ${getContactColor(
                          0,
                        )}`}
                      >
                        <p className="text-PrimaryTextColor">{getInitialFromName(select.remote.name, 2)}</p>
                      </div>
                      <div className="flex flex-col justify-start items-start w-full">
                        <p>{select.remote.name}</p>
                        <div className="flex flex-row justify-start items-center gap-3">
                          <img src={getAssetLogo(select.remote.ftIndex)} className="w-8 h-8" alt="info-icon" />
                          <p className="opacity-60">{`${select.remote.amount} ${
                            getFtFromSub(select.remote.ftIndex).symbol
                          }`}</p>
                        </div>
                      </div>
                    </div>
                    <img
                      src={ChevIcon}
                      style={{ width: "2rem", height: "2rem" }}
                      alt="chevron-icon"
                      className={`${subsOpen ? "rotate-90" : ""}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="text-lg bg-PrimaryColorLight w-[25rem] rounded-lg dark:bg-SecondaryColor z-[2000] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-SelectRowColor"
              sideOffset={5}
              align="end"
            >
              <div className="flex flex-col justify-start items-start w-full p-1 gap-2">
                <CustomInput
                  prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
                  sizeInput={"small"}
                  intent={"secondary"}
                  placeholder=""
                  compOutClass=""
                  value={searchKey}
                  onChange={onSearchChange}
                />
                <div className="flex flex-col justify-start items-start w-full scroll-y-light max-h-[calc(100vh-30rem)]">
                  {getRemotesToSelect().map(({ remote: rmt, principal: prin }, k) => {
                    return (
                      <button
                        key={k}
                        className="p-1 flex flex-row justify-start items-center w-full gap-4 text-sm hover:bg-SelectRowColor/10 border-b border-b-BorderColor/10"
                        onClick={() => {
                          onSelectRemote(rmt, prin);
                        }}
                      >
                        <div className="p-1 flex flex-row justify-start items-center w-full gap-4 text-sm">
                          <div
                            className={`flex justify-center items-center !min-w-[2rem] w-8 h-8 rounded-md ${getContactColor(
                              0,
                            )}`}
                          >
                            <p className="text-PrimaryTextColor">{getInitialFromName(rmt.name, 2)}</p>
                          </div>
                          <div className="flex flex-col justify-start items-start w-full">
                            <p>{rmt.name}</p>
                            <div className="flex flex-row justify-start items-center gap-3">
                              <img src={getAssetLogo(rmt.ftIndex)} className="w-8 h-8" alt="info-icon" />
                              <p className="opacity-60">{`${rmt.amount} ${getFtFromSub(rmt.ftIndex).symbol}`}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </Fragment>
  );
  function onChangePrincipal(e: ChangeEvent<HTMLInputElement>) {
    setSelect({
      ...select,
      principal: e.target.value,
    });
  }
  function onChangeIdx(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "" || /^\+?([0-9]\d*)$/.test(value))
      setSelect({
        ...select,
        vIdx: value === "" ? "" : Number(value).toString(),
      });
  }
  function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchKey(e.target.value);
  }
  function getRemotesToSelect() {
    const auxRemotes: { remote: HplRemote; principal: string }[] = [];
    hplContacts.map((cntc) => {
      cntc.remotes.map((rmt) => {
        auxRemotes.push({ principal: cntc.principal, remote: { ...rmt, name: `${cntc.name} [${rmt.name}]` } });
      });
    });
    return auxRemotes;
  }
  function onSelectRemote(rmt: HplRemote, prin: string) {
    setSelect({ ...select, subaccount: undefined, principal: prin, vIdx: rmt.index, remote: rmt });
    setSubsOpen(false);
  }
};

export default SelectTxRemote;
