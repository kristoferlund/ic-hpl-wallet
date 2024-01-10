import { TAllowance } from "@/@types/allowance";

export const initialAllowanceState: TAllowance = {
  asset: {
    logo: "",
    name: "",
    symbol: "",
    subAccounts: [],
    address: "",
    decimal: "",
    sort_index: 0,
    index: "",
    tokenName: "",
    tokenSymbol: "",
    shortDecimal: "",
  },
  subAccount: {
    name: "",
    sub_account_id: "",
    address: "",
    amount: "",
    currency_amount: "",
    transaction_fee: "",
    decimal: 0,
    symbol: "",
  },
  spender: {
    name: "",
    accountIdentifier: "",
    principal: "",
  },
  amount: "",
  expiration: "",
  noExpire: true,
};

export default function AllowanceList() {
  return <p>Allowance list</p>;
}
