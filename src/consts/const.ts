export const ACCESS_TOKEN = "access_token";
export const path = {
  home: "/",
  login: "/login",
  register: "/register",
  logout: "/logout",
  productDetail: ":nameId",
  cart: "/cart",
} as const;

export const pathUser = {
  user: "/user",
  profile: "profile",
  changePassword: "changepassword",
  historyPurchase: "purchase",
} as const;

export const event = {
  clearLS: "clearLS",
};

export const maxSizeUploadAvatar = 1048576; //bytes
