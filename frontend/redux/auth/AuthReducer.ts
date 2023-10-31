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
  superAdmin: boolean;
  authClient: string;
  assetList: Asset[];
  theme: string;
  blur: boolean;
  disclaimer: boolean;

  userAgent: HttpAgent;
  userPrincipal: Principal;
}

const initialState: AuthState = {
  route: RoutingPathEnum.Enum.LOGIN,
  authLoading: true,
  authenticated: false,
  superAdmin: false,
  theme: ThemesEnum.enum.dark,
  blur: false,
  authClient: "",
  assetList: [],
  disclaimer: true,
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
      state.authClient = "";
    },
    setAuthenticated: {
      reducer(state, action: PayloadAction<{ authenticated: boolean; superAdmin: boolean; authClient: string }>) {
        const { authenticated, superAdmin, authClient } = action.payload;
        state.authLoading = false;
        state.authenticated = authenticated;
        state.superAdmin = superAdmin;
        state.authClient = authClient;
      },
      prepare(authenticated: boolean, superAdmin: boolean, authClient: string) {
        return {
          payload: { authenticated, superAdmin, authClient },
        };
      },
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
    },
  },
});
export const {
  setRoutingPath,
  clearDataAuth,
  setAuth,
  setAuthLoading,
  setUnauthenticated,
  setAuthenticated,
  setAuthClient,
  setTheme,
  setBlur,
  setDisclaimer,
  setUserAgent,
  setUserPrincipal,
} = authSlice.actions;

export default authSlice.reducer;
