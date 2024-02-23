// svgs
import { ReactComponent as ChevronIcon } from "@/assets/svg/files/chevron-right.svg";
import { ReactComponent as UsaFlagIcon } from "@/assets/svg/files/usa.svg";
import { ReactComponent as SpainFlagIcon } from "@/assets/svg/files/españa.svg";
import { ReactComponent as ItalyFlagIcon } from "@/assets/svg/files/italia.svg";
import { ReactComponent as BrazilFlagIcon } from "@/assets/svg/files/brazil.svg";
import { ReactComponent as SunIcon } from "@/assets/svg/files/sun-icon.svg";
import { ReactComponent as WalletIcon } from "@/assets/svg/files/wallet-icon.svg";
import { ReactComponent as RefreshIcon } from "@/assets/svg/files/refresh-ccw.svg";
import { ReactComponent as HplLogo } from "@/assets/svg/files/hpl-logo.svg";
import { ReactComponent as HpllogoLight } from "@/assets/svg/files/hpl-wallet-light.svg";
//
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { ThemeHook } from "@hooks/themeHook";
import { LanguageHook } from "@hooks/languageHook";
import { clsx } from "clsx";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AccountHook } from "@hooks/accountHook";
import { shortAddress } from "@/utils";
import { logout } from "@redux/CheckAuth";
import Modal from "@components/Modal";
import ThemeModal from "./themeModal";
import { ThemesEnum } from "@/const";
import { CustomCopy } from "@components/CopyTooltip";
import { AssetHook } from "@pages/home/hooks/assetHook";
import HplSettingsModal from "./hplSettings";
import { useAppSelector } from "@redux/Store";
import { db } from "@/database/db";
import DbLocationModal from "./dbLocationModal";

const TopBarComponent = ({ isLoginPage }: { isLoginPage: boolean }) => {
  const { t } = useTranslation();
  const { onLanguageChange } = LanguageHook();
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const { theme, themeOpen, setThemeOpen } = ThemeHook();
  const { authClient } = AccountHook();
  const { getTotalAmountInCurrency, reloadBallance, assetLoading } = AssetHook();

  const [langOpen, setLangOpen] = useState(false);
  const [dbLocationOpen, setDbLocationOpen] = useState(false);

  const langOpts = [
    { abrev: "en", name: "english", flag: <UsaFlagIcon className={flag} /> },
    { abrev: "es", name: "spanish", flag: <SpainFlagIcon className={flag} /> },
    { abrev: "it", name: "italian", flag: <ItalyFlagIcon className={flag} /> },
    { abrev: "pt", name: "portuguese", flag: <BrazilFlagIcon className={flag} /> },
  ];

  return (
    <Fragment>
      <div className="flex flex-row justify-between min-h-[4.5rem] w-full bg-PrimaryColorLight dark:bg-PrimaryColor text-PrimaryTextColorLight dark:text-PrimaryTextColor ">
        <div className="flex flex-row justify-start items-center pl-9 gap-24 text-md">
          {theme === ThemesEnum.enum.dark ? (
            <HplLogo className="max-w-[7rem] h-auto" />
          ) : (
            <HpllogoLight className="max-w-[7rem] h-auto" />
          )}
          {!isLoginPage && (
            <div className="flex flex-row justify-start items-center gap-3">
              <p className="opacity-50">{shortAddress(authClient, 12, 10)}</p>
              <CustomCopy size={"small"} copyText={authClient} />
              <RefreshIcon
                className={`h-4 w-4 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor ${
                  assetLoading ? "do-spin" : ""
                }`}
                onClick={handleReloadButton}
              />
              {watchOnlyMode && <p className="opacity-50">{t("watchOnlyMode.title")}</p>}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-start items-center pr-9 gap-9">
          {!isLoginPage && (
            <div className="flex flex-row justify-start items-center gap-2 text-md">
              <WalletIcon className="fill-SvgColor dark:fill-SvgColor max-w-[1.5rem] h-auto"></WalletIcon>
              <p className="opacity-70">{t("total.balance")}:</p>
              <p className="font-medium">{`$${getTotalAmountInCurrency().toFixed(2)}`}</p>
              <p className="opacity-70">USD</p>
            </div>
          )}
          <DropdownMenu.Root
            modal={false}
            onOpenChange={() => {
              setLangOpen(false);
            }}
          >
            <DropdownMenu.Trigger asChild>
              <button className="p-0 outline-none">
                <SunIcon className="fill-SvgColor dark:fill-SvgColor max-w-[2rem] h-auto"></SunIcon>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="text-lg bg-PrimaryColorLight rounded-lg dark:bg-SecondaryColor mr-4 z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className={clsx(gearPopItem, "!justify-between", "rounded-t-lg")}
                  onSelect={(e: Event) => {
                    e.preventDefault();
                    setLangOpen(!langOpen);
                  }}
                >
                  <p>{t("language.word")}</p>
                  <ChevronIcon className={`fill-SvgColor dark:fill-SvgColor ${langOpen ? "" : "-rotate-90"}`} />
                </DropdownMenu.Item>
                {langOpen &&
                  langOpts.map((lOpt, k) => {
                    return (
                      <DropdownMenu.Item
                        key={k}
                        className={clsx(gearPopItem)}
                        onSelect={() => {
                          setLangOpen(false);
                          changeLanguage(lOpt.abrev);
                        }}
                      >
                        {lOpt.flag}
                        <p>{t(lOpt.name)}</p>
                      </DropdownMenu.Item>
                    );
                  })}
                <DropdownMenu.Item
                  className={clsx(gearPopItem, "!justify-between")}
                  onSelect={() => {
                    setThemeOpen("THEMES");
                  }}
                >
                  <p>{t("themes")}</p>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className={clsx(gearPopItem, "!justify-between")}
                  onSelect={() => {
                    setThemeOpen("SETTINGS");
                  }}
                >
                  <p>{t("hpl.settings")}</p>
                </DropdownMenu.Item>
                {isLoginPage ? (
                  <DropdownMenu.Item
                    className={clsx(gearPopItem, "!justify-between", "rounded-b-lg")}
                    onSelect={() => {
                      setDbLocationOpen(true);
                    }}
                  >
                    <p>{t("database.location")}</p>
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item
                    className={clsx(gearPopItem, "!justify-between", "rounded-b-lg")}
                    onSelect={() => {
                      logout();
                    }}
                  >
                    <p className="text-LockColor">{t("lock")}</p>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      <Modal open={themeOpen !== ""} top="top-[35%]">
        {themeOpen === "THEMES" ? <ThemeModal setOpen={setThemeOpen} /> : <HplSettingsModal setOpen={setThemeOpen} />}
      </Modal>
      <Modal open={dbLocationOpen} top="top-[35%]">
        <DbLocationModal setOpen={setDbLocationOpen} />
      </Modal>
    </Fragment>
  );

  function handleReloadButton() {
    reloadBallance();
  }

  function changeLanguage(lang: string) {
    onLanguageChange(lang);
    i18n.changeLanguage(lang, () => {
      db().setLanguage(lang);
    });
  }
};
export default TopBarComponent;

// Tailwind CSS constants
const flag = clsx("mr-1", "max-h-[1.5rem]");
const gearPopItem = clsx(
  "flex",
  "flex-row",
  "justify-start",
  "items-center",
  "py-2",
  "px-4",
  "bg-none",
  "w-full",
  "min-w-[13rem]",
  "cursor-pointer",
  "outline-none",
  "hover:bg-PopSelectColorLight",
  "dark:hover:bg-PopSelectColor",
);
