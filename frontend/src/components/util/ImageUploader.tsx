import React, { useState } from "react";
import { Label } from "../ui/label";

interface ImageUploaderProps {
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageUploader = ({ setImages }: ImageUploaderProps) => {
  const [dragging, setDragging] = useState(false);
  const [invalidFileType, setInvalidFileType] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const validFiles = files.filter((file) => imageTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      setInvalidFileType(true);
    } else {
      setInvalidFileType(false);
    }

    const newImageURLs = validFiles.map((file) => URL.createObjectURL(file));

    setImages((prevImages) => [...prevImages, ...newImageURLs]);
  };

  return (
    <div
      className={`border border-dashed border-gray-500 py-4 px-2 mt-auto rounded-lg overflow-hidden flex flex-col justify-center items-center space-y-2 h-64 w-full ${
        dragging ? "bg-gray-200" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}>
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500 flex flex-col">
          <span>Drag & drop your images here or</span>
          <Label className="underline cursor-pointer" htmlFor="file">
            browse your device
          </Label>
          {invalidFileType && <span className="text-red-500">We only support PNG, JPG and JPEG images.</span>}
        </p>
      </div>
      <input
        className="sr-only"
        id="file"
        multiple
        type="file"
        accept=".png, .jpg, .jpeg, .webp"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default ImageUploader;
