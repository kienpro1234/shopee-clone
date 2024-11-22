import { ACCESS_TOKEN } from "../consts/const";
import { User } from "../types/user.type";

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem(ACCESS_TOKEN, access_token);
};

export const clearLS = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem("profile");
};

export const getAccessTokenFromLS = () => localStorage.getItem(ACCESS_TOKEN) || "";

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile: User) => {
  localStorage.setItem("user", JSON.stringify(profile));
};
