import { clsx, type ClassValue } from "clsx";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOTP() {
  return (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString(); //Return random number between 100000-999999
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === currentDate.getFullYear() ? "numeric" : undefined,
  };

  return date.toLocaleDateString("en-US", options);
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export function removeAllCookies() {
  Object.keys(Cookies.get()).forEach(function (cookieName) {
    Cookies.remove(cookieName);
  });
  window.location.reload();
}

export function goto(url: string, timeToProceed: number = 0) {
  setTimeout(() => {
    window.location.href = url;
  }, timeToProceed);
}

export function applyDiscount(price: number, discount: number) {
  let discountedPrice = Math.floor(price * (1 - discount / 100));
  discountedPrice = discountedPrice - (discountedPrice % 1) + 0.99;
  return discountedPrice;
}

export function setStateDelayed(setState: void, time: number) {
  setTimeout(() => {
    setState;
  }, time);
}

export function newAbortSignal() {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 5000 || 0);

  return abortController.signal;
}

export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

declare global {
  interface String {
    capitalize(): string;
  }
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

type ParamsObject = {
  [key: string | number]: string | string[] | number | number[];
};

export function buildQueryParams(paramsObj: ParamsObject) {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(paramsObj)) {
    switch (typeof value) {
      case "number":
        queryParams.append(key, value.toString());
        break;
      case "string":
        queryParams.append(key, value);
        break;
      case "object":
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item.toString()));
        }
        break;
    }
  }
  return queryParams.toString();
}

export function getAmountOfValuesInObjectOfObjects(obj: object) {
  return Object.values(obj).reduce((acc, obj) => acc + Object.keys(obj).length, 0);
}

export function shortenText(str: string) {
  return str.length > 80 ? `${str.slice(0, 80)}...` : str;
}

export function includesAny(value, arr) {
  return arr.some((category) => value == category);
}

export function makeEndBy99(num: number) {
  console.log(num);
  if (num) {
    return !num?.toFixed(2).endsWith(".99") ? (num + 0.99).toFixed(2) : num?.toFixed(2);
  }
}

export function removeLeadingZeroes(number) {
  const stringWithoutZeroes = String(number).replace(/^0+/, "");
  const result = parseInt(stringWithoutZeroes, 10);
  return isNaN(result) ? 0 : result;
}
