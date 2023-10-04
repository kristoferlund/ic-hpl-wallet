import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/Button";
import { AssetHook } from "@pages/home/hooks/assetHook";
import { useContacts } from "@pages/contacts/hooks/contactsHook";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setRoutingPath } from "@redux/auth/AuthReducer";
import { RoutingPath, RoutingPathEnum } from "@/const";

const Menu = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { route } = useAppSelector((state) => state.auth);
  const { assets, assetLoading } = AssetHook();
  const { contacts } = useContacts();

  const menuList = [
    {
      name: "Assets",
      path: RoutingPathEnum.Enum.HOME,
      label: `${assets?.length !== 1 ? t("assets") : t("asset")} (${assets?.length})`,
    },
    {
      name: "Contacts",
      path: RoutingPathEnum.Enum.CONTACTS,
      label: `${assets?.length !== 1 ? t("contacts") : t("contact")} (${contacts?.length})`,
    },
  ];

  return (
    <Fragment>
      <div className="flex flex-row gap-3 justify-start items-center w-full">
        {menuList.map((menu, k) => (
          <CustomButton
            key={k}
            size={"small"}
            intent={"noBG"}
            border={"underline"}
            className="flex flex-row justify-start items-center mb-4"
            onClick={() => {
              handleMenuClic(menu.path);
            }}
          >
            <p
              className={`!font-normal  mr-2 ${
                route !== menu.path
                  ? " text-PrimaryTextColorLight/60 dark:text-PrimaryTextColor/60"
                  : "border-b border-SelectRowColor"
              }`}
            >
              {menu.label}
            </p>
          </CustomButton>
        ))}
        {assetLoading && (
          <div className=" mt-[-1rem] inline-block w-4 h-4 after:block after:w-4 after:h-4 after:rounded-[50%] after:border-[0.2rem] after:border-t-SelectRowColor after:border-b-SelectRowColor after:border-r-transparent after:border-l-transparent lds-dual-ring"></div>
        )}
      </div>
    </Fragment>
  );

  function handleMenuClic(path: RoutingPath) {
    dispatch(setRoutingPath(path));
  }
};

export default Menu;
