import React, { useEffect, useId, useRef, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { BsCloudCheck } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { Note } from "../contexts/NotesCategoriesContext";
import { useNotesCategoriesContext } from "../hooks/useNotesCategoriesContext";
import ImageUploadItem from "./ImageUploadItem";

interface NoteFormProps {
  noteData?: Note | null;
  editMode?: boolean;
  handleModalClose?: () => void;
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
  handleModalClose,
}) => {
  const { categories, updating, uploading, addNote, editNote } =
    useNotesCategoriesContext();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const initialFormData: FormData = {
    _id: noteData?._id || "",
    title: noteData?.title || "",
    content: noteData?.content || "",
    category: noteData?.category || "",
    photos: noteData?.photos || [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Function to handle form field changes
  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(async () => {
      if (formData._id) {
        editNote(formData, editMode ? true : false);
      } else {
        const newNote = await addNote(formData, false);
        setFormData({ ...formData, _id: newNote._id });
      }
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

  const handleSaveNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData._id) {
      editNote(formData, true);
    } else {
      const newNote = await addNote(formData, true);
      setFormData({ ...formData, _id: newNote._id });
    }
    !editMode &&
      setFormData({
        _id: "",
        title: "",
        content: "",
        category: "",
        photos: [],
      });

    handleModalClose && handleModalClose();
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 20
      }px`;
    }
  }, [formData]);

  return (
    <>
      <div className="w-full rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-white ">
        <div className={`${editMode ? "p-0" : " md:p-3 "} p-2 overflow-hidden`}>
          <form
            onSubmit={(e) => handleSaveNote(e)}
            className="md:p-5 p-2 rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-blue-200 overflow-y-auto max-h-[500px]"
          >
            <div className="flex justify-between relative">
              {!editMode ? (
                <>
                  <div>
                    <div className="w-9 h-1 bg-green-500 rounded "></div>
                    <h3 className=" text-lg">Create New Note</h3>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full mx-auto"></div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex justify-between items-center gap-2">
              {/* Category Dropdown */}
              <select
                value={formData.category}
                onChange={handleChange}
                name="category"
                className="py-2 px-3 bg-transparent w-32 outline-none mt-2 text_color rounded-md border border-gray-600 text-sm text-[#aaaaaa]"
              >
                <option value="">Category</option>
                {/* Render categories dynamically based on data */}
                {/* Example: */}
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className={` md:text-base text-sm text_color`}>
                {uploading || updating ? (
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

            <div className="flex gap-2 justify-between items-center">
              <div className="flex-1">
                <input
                  value={formData.title}
                  onChange={handleChange}
                  name="title"
                  className="py-2 bg-transparent w-full outline-none placeholder:text-[#676767] text-[#aaaaaa]"
                  type="text"
                  placeholder="Note Title"
                  required
                />
              </div>
            </div>
            <textarea
              value={formData.content}
              onChange={handleChange}
              ref={textareaRef}
              name="content"
              className="py-2 bg-transparent w-full outline-none mt-2 placeholder:text-[#676767] text-[#aaaaaa]"
              placeholder="Note content"
            />

            {/* Display existing photos */}
            {formData.photos.length > 0 && (
              <div
                className={`mt-4 flex-wrap gap-4 ${
                  editMode ? "block" : "flex"
                }`}
              >
                {formData.photos.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`/api/uploads/${preview.filename}`}
                      alt={`Uploaded Preview ${index + 1}`}
                      className={`w-48 h-48 object-cover rounded-lg  ${
                        editMode ? "w-full h-auto mb-3" : " "
                      }`}
                    />
                    <div
                      onClick={() => handleRemove(preview)}
                      className="w-6 h-6 bg-black rounded-full mx-auto text-xs flex items-center justify-center cursor-pointer text-white absolute top-1 right-1 "
                      title="Remove"
                    >
                      <HiOutlineTrash />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedFiles.map((file, index) => (
              <ImageUploadItem
                key={index}
                file={file}
                index={index}
                onUploadSuccess={onUploadComplete}
              />
            ))}
            <div className="flex justify-end items-center gap-2">
              {/* Image Upload */}
              <label
                htmlFor={id}
                className=" text-gray-400 hover:bg-gray-700 rounded-full duration-300 flex justify-center items-center h-7 w-7 cursor-pointer"
              >
                <BiImageAdd className="inline-block text-xl" />
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                id={id}
                className="hidden"
              />
              <div className="flex justify-end ">
                <button className="py-1 px-3 bg-green-500 hover:bg-transparent border hover:text-green-500 border-green-500 text-black font-bold rounded-md text-sm duration-300">
                  Save
                  {/* Button text based on _id */}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NoteForm;
