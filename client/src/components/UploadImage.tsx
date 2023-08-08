import React, { useState } from "react";
import { AiOutlineCloudUpload, AiOutlineLink } from "react-icons/ai";
import ImageUploadItem from "./ImageUploadItem";

interface ImageUploadProps {
  onUploadComplete: (
    uploadedImages: Array<{ filename: string; originalName: string }>
  ) => void;
  handleClose: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  handleClose,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ filename: string; originalName: string }>
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(newFiles);
    }
  };

  const handleUploadSuccess = (filename: string, originalName: string) => {
    // Update the filename of the specified image
    setUploadedImages((prev) => [...prev, { filename, originalName }]);
  };

  return (
    <div className="">
      <label
        htmlFor="imageInput"
        className="w-full flex flex-col items-center justify-center p-5 h-52 rounded-md border border-dashed border-gray-400"
      >
        <AiOutlineCloudUpload className="text-7xl inline-block mx-auto" />
        <span className="text-sm text_color">
          Select or Drag and Drop image (Only .jgp, .jpeg, .png and .gif)
        </span>
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        id="imageInput"
        className="hidden"
      />
      <div>
        {selectedFiles.map((file, index) => (
          <ImageUploadItem
            key={index}
            file={file}
            index={index}
            onUploadSuccess={handleUploadSuccess}
          />
        ))}
      </div>
      <div className="flex justify-end mt-5">
        <button
          onClick={() => {
            onUploadComplete(uploadedImages);
            handleClose();
          }}
          className="rounded-md bg-blue-400 px-3 py-1.5 text-black font-bold flex gap-2 items-center"
        >
          <span>
            <AiOutlineLink />
          </span>{" "}
          Link
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
