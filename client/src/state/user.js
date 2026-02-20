import { atom } from "jotai";

export const userAtom = atom(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {
    isAuthenticated: false,
  };
  return userInfo;
});

export const setUserAtom = atom(
  null,
  (get, set, newValue) => {
    set(userAtom, newValue);
    localStorage.setItem("userInfo", JSON.stringify(newValue));
  }
);
