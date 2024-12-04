import { ACCESS_TOKEN, event } from "../consts/const";
import { User } from "../types/user.type";

export const LocalStorageEventTarget = new EventTarget();

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem(ACCESS_TOKEN, access_token);
};

export const clearLS = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem("profile");
  const clearLsEvent = new Event(event.clearLS);
  LocalStorageEventTarget.dispatchEvent(clearLsEvent);
};

export const getAccessTokenFromLS = () => localStorage.getItem(ACCESS_TOKEN) || "";

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile: User) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};
