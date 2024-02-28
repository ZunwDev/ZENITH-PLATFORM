import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./configs";
import { v4 as uuidv4 } from "uuid";

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

export function newAbortSignal(timeoutMs: number) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);

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

export async function uploadImagesToFirebase(productId: string, images: string[], imageThumbnail) {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  try {
    const filteredImages = images.filter((image) => image !== imageThumbnail);

    // Upload the imageThumbnail only if there are no regular images left
    if (filteredImages.length === 0) {
      const thumbnailImageResponse = await fetch(imageThumbnail);
      const thumbnailBlob = await thumbnailImageResponse.blob();

      const imageName = `image_${uuidv4()}_thumbnail`; // Include UUID in thumbnail image name
      const thumbnailStorageRef = ref(storage, `images/${productId}/${imageName}`);
      await uploadBytes(thumbnailStorageRef, thumbnailBlob);

      const thumbnailImageUrl = await getDownloadURL(thumbnailStorageRef);
      return [thumbnailImageUrl]; // Return thumbnail image URL
    }

    // Upload regular images
    const regularImagePromises = filteredImages.map(async (blobUrl) => {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      const imageName = `image_${uuidv4()}`;
      const storageRef = ref(storage, `images/${productId}/${imageName}`);
      await uploadBytes(storageRef, blob);
    });

    const regularImageUrls = await Promise.all(regularImagePromises);

    // --------------------------
    // Upload the thumbnail image
    const thumbnailImageResponse = await fetch(imageThumbnail);
    const thumbnailBlob = await thumbnailImageResponse.blob();

    const thumbnailImageName = `image_${uuidv4()}_thumbnail`;
    const thumbnailStorageRef = ref(storage, `images/${productId}/${thumbnailImageName}`);
    await uploadBytes(thumbnailStorageRef, thumbnailBlob);

    return regularImageUrls; // Return regular image URLs
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

export async function getImagesFromFirebase(productId: string) {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const storageRef = ref(storage, `images/${productId}`);

  try {
    const items = await listAll(storageRef);
    const downloadURLs: string[] = [];
    await Promise.all(
      items.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        downloadURLs.push(url);
      })
    );
    return downloadURLs;
  } catch (error) {
    console.error("Error retrieving images from Firebase Storage:", error);
    throw error;
  }
}

export async function getThumbnailFromFirebase(productId: string) {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const storageRef = ref(storage, `images/${productId}`);

  try {
    const items = await listAll(storageRef);
    const thumbnailURLs: string[] = [];
    const thumbnailItems = items.items.filter((item) => item.name.includes("_thumbnail"));

    await Promise.all(
      thumbnailItems.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        thumbnailURLs.push(url);
      })
    );

    return thumbnailURLs;
  } catch (error) {
    console.error("Error retrieving thumbnail image from Firebase Storage:", error);
    throw error;
  }
}
