import { HttpAgent } from "@dfinity/agent";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Asset } from "@redux/models/AccountModels";
import { RoutingPath, RoutingPathEnum, ThemesEnum } from "@/const";
import { Principal } from "@dfinity/principal";

const defaultValue: any = {};
interface AuthState {
  route: RoutingPath;
  authLoading: boolean;
  authenticated: boolean;
  debugMode: boolean;
  superAdmin: boolean;
  watchOnlyMode: boolean;
  authClient: string;
  assetList: Asset[];
  theme: string;
  blur: boolean;
  disclaimer: boolean;
  hplLedger: string;
  hplDictionary: string;
  userAgent: HttpAgent;
  userPrincipal: Principal;
}

const initialState: AuthState = {
  route: RoutingPathEnum.Enum.LOGIN,
  authLoading: true,
  authenticated: false,
  debugMode: false,
  superAdmin: false,
  watchOnlyMode: false,
  theme: ThemesEnum.enum.dark,
  blur: false,
  authClient: "",
  assetList: [],
  disclaimer: true,
  hplLedger: "rqx66-eyaaa-aaaap-aaona-cai",
  hplDictionary: "",
  userAgent: defaultValue,
  userPrincipal: defaultValue,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRoutingPath(state, action) {
      state.route = action.payload;
    },
    setAuth(state) {
      state.authLoading = false;
    },
    setAuthLoading(state, action) {
      state.authLoading = action.payload;
    },
    setUnauthenticated(state) {
      state.authLoading = false;
      state.authenticated = false;
      state.superAdmin = false;
      state.watchOnlyMode = false;
      state.authClient = "";
      state.debugMode = false;
    },
    setAuthenticated: {
      reducer(state, action: PayloadAction<{ authenticated: boolean; superAdmin: boolean; watchOnlyMode: boolean; authClient: string }>) {
        const { authenticated, superAdmin, watchOnlyMode, authClient } = action.payload;
        state.authLoading = false;
        state.authenticated = authenticated;
        state.superAdmin = superAdmin;
        state.watchOnlyMode = watchOnlyMode;
        state.authClient = authClient;
      },
      prepare(authenticated: boolean, superAdmin: boolean, watchOnlyMode: boolean, authClient: string) {
        return {
          payload: { authenticated, superAdmin, watchOnlyMode, authClient },
        };
      },
    },
    setDebugMode(state, action) {
      state.debugMode = action.payload;
    },
    setAuthClient(state, action) {
      state.authClient = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setBlur(state, action) {
      state.blur = action.payload;
    },
    setDisclaimer(state, action) {
      state.disclaimer = action.payload;
    },
    setHplLedgerPrincipal(state, action) {
      state.hplLedger = action.payload;
    },
    setHplDictionaryPrincipal(state, action) {
      state.hplDictionary = action.payload;
    },
    setUserAgent(state, action) {
      state.userAgent = action.payload;
    },
    setUserPrincipal(state, action) {
      state.userPrincipal = action.payload;
    },
    clearDataAuth(state) {
      state.userAgent = defaultValue;
      state.userPrincipal = defaultValue;
      state.authClient = "";
      state.debugMode = false;
    },
  },
});
export const {
  setRoutingPath,
  clearDataAuth,
  setAuth,
  setAuthLoading,
  setUnauthenticated,
  setDebugMode,
  setAuthenticated,
  setAuthClient,
  setTheme,
  setBlur,
  setDisclaimer,
  setHplLedgerPrincipal,
  setHplDictionaryPrincipal,
  setUserAgent,
  setUserPrincipal,
} = authSlice.actions;

export default authSlice.reducer;
