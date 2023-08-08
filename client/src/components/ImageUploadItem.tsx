import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { ImSpinner3 } from "react-icons/im";

interface ImageUploadItemProps {
  file: File;
  index: number;
  onUploadSuccess: (filename: string, originalName: string) => void;
}

const ImageUploadItem: React.FC<ImageUploadItemProps> = ({
  file,
  onUploadSuccess,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const uploadImage = async () => {
    setError("");
    try {
      const formData = new FormData();
      formData.append("images", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      // Upload progress event listener
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 90);
          setUploadProgress(progress);
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);

            if (result.success) {
              onUploadSuccess(
                result.images[0].filename,
                result.images[0].originalName
              );
              setUploadProgress(100);
            } else {
              setError(result.message);
            }
          } else {
            setError(`Upload failed with status: ${xhr.status}`);
          }
        }
      };

      xhr.send(formData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    // Start uploading the image when the component mounts
    uploadImage();
  }, []);

  return (
    <div className="my-2">
      <div className="flex justify-between items-center">
        <span>
          {uploadProgress < 100 ? "Uploading: " : "Done: "}
          {file.name}
        </span>
        <span>
          {uploadProgress < 100 ? (
            <ImSpinner3 className="animate-spin" />
          ) : (
            <BsCheckCircleFill className="text-green-500" />
          )}
        </span>
      </div>
      {/* <progress value={uploadProgress} max={100} /> */}
      <div
        className={`h-2 rounded-md bg_green_gradient skeleton-box ${
          uploadProgress <= 90 ? " duration_ten " : " duration-300 "
        }`}
        style={{ width: `${uploadProgress}%` }}
      ></div>
      {error && (
        <p className="text-red-500">
          {error}{" "}
          <span
            onClick={() => uploadImage()}
            className="underline cursor-pointer text-white"
          >
            Retry
          </span>
        </p>
      )}
    </div>
  );
};

export default ImageUploadItem;
