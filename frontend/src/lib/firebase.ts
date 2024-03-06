import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";
import { firebaseConfig } from "./configs";
import { v4 as uuidv4 } from "uuid";

export function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  return getStorage(app);
}

async function setThumbnailMetadata(storage, productId, thumbnailImage) {
  try {
    const thumbnailRef = ref(storage, `images/${productId}/${getImageNameFromUrl(thumbnailImage)}`);
    await updateMetadata(thumbnailRef, { customMetadata: { isThumbnail: "true" } });
  } catch (error) {
    console.error("Error setting thumbnail metadata:", error);
    throw error;
  }
}

function getImageNameFromUrl(imageUrl: string): string {
  const parts = imageUrl.split("/");
  const lastPart = parts[parts.length - 1];

  const startIndex = lastPart.indexOf("image_");
  const endIndex = lastPart.indexOf("?", startIndex);
  return lastPart.substring(startIndex, endIndex !== -1 ? endIndex : undefined);
}

function getImageNameFromFileName(fileName: string) {
  return fileName.split("/").pop();
}

export async function getImagesFromFirebase(productId: string) {
  try {
    const storage = initializeFirebase();
    const storageRef = ref(storage, `images/${productId}`);

    const items = await listAll(storageRef);
    const downloadURLs = await Promise.all(items.items.map(async (itemRef) => getDownloadURL(itemRef)));

    return downloadURLs;
  } catch (error) {
    console.error("Error retrieving images from Firebase Storage:", error);
    throw error;
  }
}

async function removeMetadataFromAllImages(storage, productId) {
  try {
    const imagesRef = ref(storage, `images/${productId}`);
    const imagesList = await listAll(imagesRef);

    for (const imageRef of imagesList.items) {
      await updateMetadata(imageRef, { customMetadata: { isThumbnail: null } });
    }

    console.log("Metadata removed from all images successfully!");
  } catch (error) {
    console.error("Error removing metadata from images:", error);
    throw error;
  }
}

export async function getThumbnailFromFirebase(productId: string) {
  try {
    const storage = initializeFirebase();
    const productImagesRef = ref(storage, `images/${productId}`);
    const items = await listAll(productImagesRef);

    // Fetch metadata for all items concurrently
    const metadataPromises = items.items.map((itemRef) => getMetadata(itemRef));
    const metadataList = await Promise.all(metadataPromises);

    // Find the thumbnail item metadata
    const thumbnailMetadata = metadataList.find((metadata) => metadata.customMetadata?.isThumbnail === "true");

    if (thumbnailMetadata) {
      const thumbnailUrl = await getDownloadURL(thumbnailMetadata.ref);
      return { url: thumbnailUrl, metadata: thumbnailMetadata.customMetadata };
    } else {
      throw new Error("Thumbnail image not found.");
    }
  } catch (error) {
    console.error("Error retrieving thumbnail image from Firebase Storage:", error);
    return { url: null, metadata: null }; // Return default values to prevent destructuring errors
  }
}

async function uploadRegularImages(storage, productId: string, imagesToUpload: string[]) {
  for (const imageUrl of imagesToUpload) {
    const imageName = `image_${uuidv4()}`;
    const imageRef = ref(storage, `images/${productId}/${imageName}`);
    const imageBlob = await fetch(imageUrl).then((response) => response.blob());
    await uploadBytes(imageRef, imageBlob);
  }
}

// Function to delete old images
async function deleteOldImages(storage, productId: string, imagesToDelete: string[]) {
  for (const filename of imagesToDelete) {
    console.log(getImageNameFromFileName(filename));
    const imageUrl = `images/${productId}/${getImageNameFromFileName(filename)}`;
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  }
}

export async function uploadImagesToFirebase(productId: string, images: string[], thumbnailImage: string) {
  const storage = getStorage(initializeApp(firebaseConfig));

  try {
    const uploadPromises = images.map(async (imageUrl) => {
      const blob = await fetch(imageUrl).then((response) => response.blob());
      const imageName = `image_${uuidv4()}`;
      const storageRef = ref(storage, `images/${productId}/${imageName}`);
      await uploadBytes(storageRef, blob);

      if (imageUrl === thumbnailImage) {
        await setThumbnailMetadata(storage, productId, imageName);
      }

      return getDownloadURL(storageRef);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

export async function uploadOrUpdateThumbnail(storage, productId: string, newThumbnailImage: string) {
  try {
    const productImagesRef = ref(storage, `images/${productId}`);
    const items = await listAll(productImagesRef);

    // Check if there is an existing thumbnail
    let thumbnailItem = null;
    for (const itemRef of items.items) {
      const metadata = await getMetadata(itemRef);
      if (metadata.customMetadata && metadata.customMetadata.isThumbnail === "true") {
        thumbnailItem = itemRef;
        break;
      }
    }

    if (thumbnailItem) {
      const existingThumbnailUrl = await getDownloadURL(thumbnailItem);
      if (existingThumbnailUrl === newThumbnailImage) {
        console.log("Thumbnail image unchanged. No update needed.");
        return;
      } else {
        console.log("Removing existing thumbnail metadata...");
        await removeMetadataFromAllImages(storage, productId);
        console.log("Setting new thumbnail metadata...");
        await setThumbnailMetadata(storage, productId, newThumbnailImage);
        console.log("Thumbnail updated successfully!");
      }
    } else {
      try {
        console.log("Uploading new thumbnail image...");
        const blob = await fetch(newThumbnailImage).then((response) => response.blob());
        const thumbnailStorageRef = ref(storage, `images/${productId}/${newThumbnailImage}`);
        await uploadBytes(thumbnailStorageRef, blob);

        console.log("Thumbnail uploaded successfully!");

        // Adding a delay of 1 second before setting metadata
        console.log("Waiting for permissions to set metadata...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Setting thumbnail metadata...");
        await setThumbnailMetadata(storage, productId, newThumbnailImage);

        console.log("Thumbnail metadata set successfully!");
      } catch (error) {
        console.error("Error uploading or updating thumbnail:", error);
      }
    }
  } catch (error) {
    console.error("Error uploading or updating thumbnail:", error);
  }
}

export async function updateProductImages(productId: string, images: string[], thumbnailImage: string) {
  const storage = initializeFirebase();
  const existingImageFilenames = await listAll(ref(storage, `images/${productId}`)).then((result) =>
    result.items.map((item) => item.fullPath)
  );

  try {
    const imagesToDelete = existingImageFilenames.filter(
      (filename) => !existingImageFilenames.some((imageUrl) => imageUrl.includes(filename))
    );

    // Determine images to upload
    const imagesToUpload = images.filter((imageUrl) => imageUrl.startsWith("blob:"));

    // Get the thumbnail image and metadata
    const { url: currentThumbnailUrl } = await getThumbnailFromFirebase(productId);

    // Check if nothing changed
    if (imagesToUpload.length === 0 && thumbnailImage === currentThumbnailUrl && imagesToDelete.length === 0) {
      console.log("No changes detected. Skipping update.");
      return;
    }

    // Upload new regular images
    await uploadRegularImages(storage, productId, imagesToUpload);

    // Upload or update the thumbnail image
    await uploadOrUpdateThumbnail(storage, productId, thumbnailImage);

    // Delete removed images from storage
    await deleteOldImages(storage, productId, imagesToDelete);

    console.log("Product images updated successfully!");
  } catch (error) {
    console.error("Error updating product images:", error);
  }
}
