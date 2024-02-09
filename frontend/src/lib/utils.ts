import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOTP() {
  const min = 100000;
  const max = 999999;
  const randomOTP = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomOTP.toString();
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
  return formattedDate;
}

export function removeAllCookies() {
  Object.keys(Cookies.get()).forEach(function (cookieName) {
    Cookies.remove(cookieName);
  });
  window.location.reload();
}

interface UserData {
  userId: number;
  username: string;
  roleId: number;
}

export function setCookies(data: UserData, duration: number) {
  Cookies.set("firstName", data.username, { expires: duration });
  Cookies.set("userId", String(data.userId), { expires: duration });
  Cookies.set("roleId", String(data.roleId), { expires: duration });
}

export function goto(url: string, timeToProceed: number = 0) {
  setTimeout(() => {
    window.location.href = url;
  }, timeToProceed);
}
