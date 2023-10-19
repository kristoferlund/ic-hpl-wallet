/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import CheckIcon from "@assets/svg/files/check.svg";
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { SubAccount } from "@redux/models/AccountModels";
import { clsx } from "clsx";
import { ChangeEvent, Fragment, useState } from "react";
import { GeneralHook } from "../../hooks/generalHook";
import { toFullDecimal } from "@/utils";
import { CustomInput } from "@components/Input";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@redux/Store";
import { AccountHook } from "@pages/hooks/accountHook";
import { Token, TokenSubAccount } from "@redux/models/TokenModels";
import { CustomCopy } from "@components/CopyTooltip";
import { addSubAccount, removeSubAcc, setSubAccountName } from "@redux/assets/AssetReducer";
import Modal from "@components/Modal";
import { CustomButton } from "@components/Button";
import bigInt from "big-integer";

interface AccountElementProps {
  subAccount: SubAccount;
  symbol: string;
  name: string;
  editNameId: string;
  setName(value: string): void;
  setEditNameId(value: string): void;
  setNewSub(value: SubAccount | undefined): void;
  tokenIndex: number;
  newSub: boolean;
  tokens: Token[];
  subaccountId: number;
}

const AccountElement = ({
  subAccount,
  symbol,
  name,
  editNameId,
  setName,
  setEditNameId,
  tokenIndex,
  setNewSub,
  newSub,
  tokens,
  subaccountId,
}: AccountElementProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { authClient } = AccountHook();
  const { selectedAccount, changeSelectedAccount } = GeneralHook();
  const chechEqId = () => {
    return subAccount?.sub_account_id === selectedAccount?.sub_account_id;
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [nameError, setNameError] = useState(false);

  return (
    <Fragment>
      <div
        aria-haspopup="true"
        className={accElemStyle()}
        onClick={() => {
          if (!newSub && selectedAccount !== subAccount) changeSelectedAccount(subAccount);
          if (editNameId !== subAccount.sub_account_id) setEditNameId("");
        }}
      >
        <div className="flex flex-col justify-center items-start">
          {editNameId === subAccount.sub_account_id ? (
            <div className="flex flex-row justify-start items-center">
              <CustomInput
                intent={"primary"}
                placeholder={""}
                value={name}
                border={nameError ? "error" : undefined}
                sizeComp="small"
                sizeInput="small"
                inputClass="!py-1"
                compOutClass="!w-1/2"
                autoFocus
                onChange={onNameChange}
              />
              <div
                className="flex justify-center items-center ml-2 p-1 bg-RadioCheckColor rounded cursor-pointer"
                onClick={onSave}
              >
                <img src={CheckIcon} className="w-4 h-4 p-" alt="info-icon" />
              </div>
              <div
                className="flex justify-center items-center ml-2 p-0 bg-LockColor rounded cursor-pointer"
                onClick={onCancel}
              >
                <img src={PlusIcon} className="w-6 h-6 rotate-45" alt="info-icon" />
              </div>
            </div>
          ) : (
            <div className="p-0 w-full text-left min-h-[1.645rem]" onDoubleClick={onDoubleClick}>
              <p className={`${accName()} break-words max-w-[9rem]`}>{`${subAccount?.name}`}</p>
            </div>
          )}
          <div className="flex flex-row justify-start items-center gap-3 min-h-5">
            <p className={`${accId()} break-words max-w-[9rem] text-left`}>{subAccount?.sub_account_id}</p>
            {chechEqId() && (
              <CustomCopy size={"xSmall"} className="p-0" copyText={subAccount?.sub_account_id.substring(2) || "0"} />
            )}
          </div>
        </div>
        <div
          className={`flex flex-row justify-between items-center gap-2 ${
            subAccount?.sub_account_id !== "0x0" && Number(subAccount?.amount) === 0 && !newSub ? "" : "pr-6"
          }`}
        >
          <div className="flex flex-col justify-center items-end">
            <p className="whitespace-nowrap">{`${toFullDecimal(subAccount?.amount, subAccount.decimal)} ${symbol}`}</p>
            <p className={accCurrencyAmnt()}>{`≈ $${Number(subAccount?.currency_amount).toFixed(2)}`}</p>
          </div>
          {subAccount?.sub_account_id !== "0x0" && Number(subAccount?.amount) === 0 && !newSub && (
            <div
              className="p-0"
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              <TrashIcon className=" fill-PrimaryTextColorLight dark:fill-PrimaryTextColor" />
            </div>
          )}
        </div>
      </div>
      <Modal
        width="w-[18rem]"
        padding="py-5 px-4"
        border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
        open={deleteModal}
      >
        <div className="reative flex flex-col justify-start items-start w-full text-md gap-4">
          <CloseIcon
            className="absolute top-5 right-5 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={() => {
              setDeleteModal(false);
            }}
          />
          <WarningIcon className="w-6 h-6" />
          <p className="w-full break-words">
            {t("delete.subacc.msg")}
            <span className="ml-1 font-semibold">
              {subAccount.name === "-" ? `${t("subacc")}-${subAccount.sub_account_id}` : subAccount.name}
            </span>
            ?
          </p>

          <div className="flex flex-row justify-end items-start w-full ">
            <CustomButton className="min-w-[5rem]" onClick={onConfirm} size={"small"}>
              <p>{t("yes")}</p>
            </CustomButton>
          </div>
        </div>
      </Modal>
    </Fragment>
  );

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    setNameError(false);
  }

  function onSave() {
    if (name !== "") {
      setEditNameId("");
      if (newSub) {
        const auxTokens = tokens.map((tkn, k) => {
          if (k === Number(tokenIndex)) {
            return {
              ...tkn,
              subAccounts: [
                ...tkn.subAccounts,
                {
                  name: name,
                  numb: subAccount.sub_account_id,
                },
              ].sort((a, b) => {
                return bigInt(a.numb).compare(bigInt(b.numb));
              }),
            };
          } else return tkn;
        });
        saveLocalStorage(auxTokens);
        dispatch(addSubAccount(tokenIndex, { ...subAccount, name: name }));
        setNewSub(undefined);
      } else {
        const auxTokens = tokens.map((tkn, k) => {
          if (k === Number(tokenIndex)) {
            const auxSubs: TokenSubAccount[] = [];
            tkn.subAccounts.map((sa) => {
              if (sa.numb === subAccount.sub_account_id) {
                auxSubs.push({ ...sa, name: name });
              } else auxSubs.push(sa);
            });
            return { ...tkn, subAccounts: auxSubs };
          } else return tkn;
        });
        saveLocalStorage(auxTokens);
        dispatch(setSubAccountName(tokenIndex, subaccountId, name));
      }
    } else {
      setNameError(true);
    }
  }

  function onCancel() {
    setEditNameId("");
    setNewSub(undefined);
  }

  function onConfirm() {
    const auxTokens = tokens.map((tkn, k) => {
      if (k === Number(tokenIndex)) {
        const auxSubs: TokenSubAccount[] = [];
        tkn.subAccounts.map((sa) => {
          if (sa.numb !== subAccount.sub_account_id) auxSubs.push(sa);
        });
        return { ...tkn, subAccounts: auxSubs };
      } else return tkn;
    });
    saveLocalStorage(auxTokens);
    dispatch(removeSubAcc(tokenIndex, subaccountId));
    setDeleteModal(false);
  }

  function saveLocalStorage(auxTokens: Token[]) {
    localStorage.setItem(
      authClient,
      JSON.stringify({
        from: "II",
        tokens: auxTokens.sort((a, b) => {
          return a.id_number - b.id_number;
        }),
      }),
    );
  }

  function onDoubleClick() {
    setEditNameId(subAccount.sub_account_id);
    setName(subAccount.name);
    setNewSub(undefined);
  }

  // Tailwind CSS
  function accElemStyle() {
    return clsx({
      ["relative flex flex-row justify-between items-center w-[calc(100%-2rem)] min-h-[3.5rem] pl-4 pr-4 text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-[rgb(51,178,239,0.24)] text-md"]:
        true,
      ["bg-[rgb(51,178,239,0.24)]"]: chechEqId() && !newSub,
      ["!bg-SvgColor"]: newSub,
    });
  }
  function accName() {
    return clsx({ ["text-[#33b2ef]"]: chechEqId() });
  }
  function accId() {
    return clsx({
      ["text-[#33b2ef]"]: chechEqId(),
      ["opacity-60"]: subAccount?.sub_account_id !== selectedAccount?.sub_account_id,
    });
  }
  function accCurrencyAmnt() {
    return clsx({
      ["opacity-60"]: subAccount?.sub_account_id !== selectedAccount?.sub_account_id,
    });
  }
};

export default AccountElement;