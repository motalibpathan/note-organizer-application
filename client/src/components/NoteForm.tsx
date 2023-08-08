import React, { useId, useState } from "react";
import { BsCloudCheck } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { TfiClose } from "react-icons/tfi";
import ImageUploadItem from "./ImageUploadItem";
import { Note } from "./NoteList";

interface NoteFormProps {
  noteData?: {
    _id: string;
    title: string;
    content: string;
    category?: string;
    photos?: Array<{ filename: string; originalName: string }>;
  } | null;
  editMode?: boolean;
  handleOnSave: (note: Note) => void;
}

interface FormData {
  _id?: string;
  title: string;
  content: string;
  category: string;
  photos: Array<{ filename: string; originalName: string }> | [];
}

const NoteForm: React.FC<NoteFormProps> = ({
  noteData,
  editMode,
  handleOnSave,
}) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const initialFormData: FormData = {
    _id: noteData?._id || "",
    title: noteData?.title || "",
    content: noteData?.content || "",
    category: noteData?.category || "",
    photos: noteData?.photos || [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Function to create or update the note on the server
  const saveNote = async () => {
    setSaving(true);
    try {
      // Use your custom fetch implementation or other HTTP library here
      const url = formData._id ? `/api/notes/${formData._id}` : `/api/notes`;
      const response = await fetch(url, {
        method: formData._id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        return setFormData((prev) => ({ ...prev, _id: result.data._id }));
      } else {
        throw new Error("Error updating note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Function to handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      saveNote();
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(newFiles);
    }
  };

  const onUploadComplete = (filename: string, originalName: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, { filename, originalName }],
    }));
    setSelectedFiles([]);
  };

  const id = useId();

  const handleRemove = (photo: { filename: string; originalName: string }) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.filename !== photo.filename),
    }));
  };

  const handleSaveNote = () => {
    saveNote();
    handleOnSave({
      _id: formData?._id || "",
      title: formData?.title || "",
      content: formData?.content || "",
      category: formData?.category || "",
      photos: formData?.photos || [],
    });
  };

  return (
    <>
      <div className="w-full rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-white">
        <div className={`${editMode ? "p-0" : "p-5"} overflow-hidden`}>
          <form className="p-5 rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-blue-200 overflow-y-auto max-h-[500px]">
            <div className="flex justify-between relative">
              {!editMode ? (
                <>
                  <div>
                    <div className="w-9 h-1 bg-green-500 rounded mb-2"></div>
                    <h3 className="mb-3 text-lg">Create New Note</h3>
                  </div>
                  <div className="">
                    <div className="flex gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mx-auto"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto"></div>
                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto"></div>
                    </div>
                  </div>
                </>
              ) : null}
              <div
                className={`absolute ${editMode ? "-top-4 " : "top-5"} right-0`}
              >
                {saving ? (
                  <div className="text_color flex items-center gap-2">
                    <span>Saving</span>
                    <PiSpinnerGapBold className="animate-spin text-lg" />{" "}
                  </div>
                ) : (
                  <div className="text_color flex items-center gap-2">
                    <span>Saved</span>
                    <BsCloudCheck />
                  </div>
                )}
              </div>
            </div>
            <input
              value={formData.title}
              onChange={handleChange}
              name="title"
              className="py-2 px-3 border-b border-gray-400 bg-transparent w-full outline-none placeholder:text-[#676767]"
              type="text"
              placeholder="Note Title"
            />
            <textarea
              value={formData.content}
              onChange={handleChange}
              name="content"
              rows={3}
              className="py-2 px-3 border-b border-gray-400 bg-transparent w-full outline-none mt-2 placeholder:text-[#676767]"
              placeholder="Note content"
            ></textarea>

            {/* Category Dropdown */}
            <select
              value={formData.category}
              onChange={handleChange}
              name="category"
              className="py-2 px-3 border-b border-gray-400 bg-transparent w-full outline-none mt-2 text_color"
            >
              <option value="">Select Category</option>
              {/* Render categories dynamically based on data */}
              {/* Example: */}
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="others">Others</option>
            </select>

            {/* Image Upload */}
            <label
              htmlFor={id}
              className="ml-3 cursor-pointer mt-3 block text_color"
            >
              <FiUpload className="mr-2 inline-block" /> Link photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              id={id}
              className="hidden"
            />

            {selectedFiles.map((file, index) => (
              <ImageUploadItem
                key={index}
                file={file}
                index={index}
                onUploadSuccess={onUploadComplete}
              />
            ))}

            {/* Display existing photos */}
            {formData.photos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {formData.photos.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`/api/uploads/${preview.filename}`}
                      alt={`Uploaded Preview ${index + 1}`}
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                    <div
                      onClick={() => handleRemove(preview)}
                      className="w-4 h-4 bg-black rounded-full mx-auto text-xs flex items-center justify-center cursor-pointer text-white absolute top-1 right-1 "
                      title="Remove"
                    >
                      <TfiClose />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-3">
              <button
                type="button" // Changed to "button" to prevent form submission
                onClick={handleSaveNote}
                className="bg-green-500 py-2 px-7 text-black rounded-md hover:bg-transparent border border-green-500 hover:text-green-500 duration-300 font-bold"
              >
                Save
                {/* Button text based on _id */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NoteForm;
