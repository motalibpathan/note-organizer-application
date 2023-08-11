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

  const {
    _id = "",
    title = "",
    content = "",
    category = "",
    photos = [],
  } = noteData || {};

  const [formData, setFormData] = useState<FormData>({
    _id,
    title,
    content,
    category,
    photos,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const id = useId();

  const isEditMode = !!formData._id;

  const handleDebounceSave = (data: FormData, time: number) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(async () => {
      if (data._id) {
        editNote(data, editMode ? true : false);
      } else {
        const newNote: Note | undefined = await addNote(formData, false);
        if (newNote) {
          setFormData((prev) => ({ ...prev, _id: newNote._id }));
        }
      }
    }, time);

    setTimeoutId(newTimeoutId);
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    handleDebounceSave({ ...formData, [name]: value }, 1000);
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

    handleDebounceSave(
      {
        ...formData,
        photos: [...formData.photos, { filename, originalName }],
      },
      1000
    );
    setSelectedFiles([]);
  };

  const handleRemove = (photo: { filename: string; originalName: string }) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.filename !== photo.filename),
    }));
  };

  const handleSaveNote = async () => {
    if (formData._id) {
      editNote(formData, true);
    } else {
      const newNote = await addNote(formData, true);
      setFormData((prev) => ({ ...prev, _id: newNote._id }));
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
    <div className="w-full rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-white relative">
      <div
        className={`${editMode ? " p-0 " : " md:p-3 "} p-2 overflow-hidden  `}
      >
        <form className="md:p-5 p-2 rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-black/20 overflow-y-auto max-h-[500px] ">
          <div className="flex justify-between ">
            {!editMode && (
              <>
                <div>
                  <div className="w-9 h-1 bg-green-500 rounded "></div>
                  <h3 className="text-lg">Create New Note</h3>
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto"></div>
                  <div className="w-4 h-4 bg-red-500 rounded-full mx-auto"></div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between items-center gap-2">
            <select
              value={formData.category}
              onChange={handleChange}
              name="category"
              className="py-1.5 px-3 bg-transparent w-32 outline-none mt-2 text_color rounded-md border border-gray-600 text-sm text-[#aaaaaa]"
            >
              <option value="">Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
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
            className="py-2 bg-transparent w-full outline-none mt-2 placeholder:text-[#676767] text-[#aaaaaa] mb-7"
            placeholder="Note content"
          />

          {formData.photos.length > 0 && (
            <div
              className={`mt-4 flex-wrap gap-4 ${
                isEditMode ? " block " : " flex "
              }`}
            >
              {formData.photos.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={`/api/uploads/${preview.filename}`}
                    alt={`Uploaded Preview ${index + 1}`}
                    className={`w-48 h-48 object-cover rounded-lg ${
                      isEditMode ? "w-full h-auto mb-3" : ""
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
        </form>
        <div className="flex justify-end items-center gap-2 w-full fixed bottom-0 left-0 px-5 py-5">
          <label
            htmlFor={id}
            className="text-gray-400 hover:bg-gray-700 rounded-full duration-300 flex justify-center items-center h-7 w-7 cursor-pointer"
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

          <button
            type="button"
            onClick={handleSaveNote}
            className="py-1 px-3 bg-green-500 hover:bg-transparent border hover:text-green-500 border-green-500 text-black font-bold rounded-md text-sm duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
