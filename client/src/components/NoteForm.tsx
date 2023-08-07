import React, { useEffect, useState } from "react";
import { BsCloudCheck } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { PiSpinnerGapBold } from "react-icons/pi";

interface NoteFormProps {
  // Define the type for the props if needed
}

interface FormData {
  _id?: string;
  title: string;
  description: string;
  category: string;
  images: File[] | null;
}

const NoteForm: React.FC<NoteFormProps> = (props) => {
  const initialFormData: FormData = {
    _id: "",
    title: "",
    description: "",
    category: "",
    images: null,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Function to create or update the note on the server
  const saveNote = async () => {
    setSaving(true);
    try {
      if (formData._id) {
        // If _id is available, it means the note already exists, so we update it
        await updateNoteOnServer(formData);
      } else {
        // If _id is not available, it means it's a new note, so we create it
        const newNoteId = await createNoteOnServer(formData);
        setFormData({ ...formData, _id: newNoteId });
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
    setSaving(false);
  };

  // Function to handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle file input change and show image previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      const newImages = [...(formData.images || []), ...imageFiles];
      setFormData({
        ...formData,
        images: imageFiles.length > 0 ? newImages || null : null,
      });

      // Show image previews
      const imagePreviewsArray: string[] = [];
      newImages?.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          imagePreviewsArray.push(reader.result as string);
          if (imagePreviewsArray.length === imageFiles.length) {
            setImagePreviews(imagePreviewsArray);
          }
        };
        reader.readAsDataURL(file);
      });
      if (imageFiles.length === 0) {
        setImagePreviews([]);
      }
    } else {
      setFormData({ ...formData, images: null });
      setImagePreviews([]);
    }
  };

  // Function to create a new note on the server
  const createNoteOnServer = async (data: FormData) => {
    try {
      // Use your custom fetch implementation or other HTTP library here
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        return result.data._id;
      } else {
        throw new Error("Error creating note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  };

  // Function to update an existing note on the server
  const updateNoteOnServer = async (data: FormData) => {
    try {
      // Use your custom fetch implementation or other HTTP library here
      const response = await fetch(`/api/notes/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        return data._id;
      } else {
        throw new Error("Error updating note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  // Function to auto-save the note data
  const handleAutoSave = () => {
    if (
      formData.title ||
      formData.description ||
      formData.category ||
      formData.images
    ) {
      // Save the note only if there are changes
      saveNote();
    }
  };

  useEffect(() => {
    // Set up the auto-save timer
    const autoSaveTimer = setTimeout(() => {
      handleAutoSave();
    }, 3000); // Auto-save every 3 seconds (adjust as needed)

    return () => {
      // Clean up the auto-save timer on component unmount
      clearTimeout(autoSaveTimer);
    };
  }, [formData]);

  return (
    <div className="w-full rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-white">
      <div className="p-5">
        <form className="p-5 rounded-2xl backdrop-blur-3xl bg-opacity-5 bg-blue-200">
          <div className="flex justify-between">
            <div>
              <div className="w-9 h-1 bg-green-500 rounded mb-2"></div>
              <h3 className="mb-3 text-lg">Create New Note</h3>
            </div>
            <div>
              <div className="flex gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto"></div>
              </div>
              {saving ? (
                <div className="text_color flex items-center gap-2">
                  <PiSpinnerGapBold className="animate-spin text-lg" />{" "}
                  <span>Saving</span>
                </div>
              ) : (
                <div className="text_color flex items-center gap-2">
                  <BsCloudCheck /> <span>Saved</span>
                </div>
              )}
            </div>
          </div>
          <input
            value={formData.title}
            onChange={handleChange}
            name="title"
            className="py-2 px-3 border border-gray-400 bg-transparent w-full rounded-md outline-none"
            type="text"
            placeholder="Note Title"
          />
          <textarea
            value={formData.description}
            onChange={handleChange}
            name="description"
            rows={5}
            className="py-2 px-3 border border-gray-400 bg-transparent w-full rounded-md outline-none mt-2"
            placeholder="Note Description"
          ></textarea>

          {/* Category Dropdown */}
          <select
            value={formData.category}
            onChange={handleChange}
            name="category"
            className="py-2 px-3 border border-gray-400 bg-transparent w-full rounded-md outline-none mt-2"
          >
            <option value="">Select Category</option>
            {/* Render categories dynamically based on data */}
            {/* Example: */}
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="others">Others</option>
          </select>

          {/* Image Upload */}
          <label htmlFor="imageUpload" className="cursor-pointer mt-3 block">
            <FiUpload className="mr-2 inline-block" /> Upload Images
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 flex gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index}>
                  <img
                    src={preview}
                    alt={`Uploaded Preview ${index + 1}`}
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button" // Changed to "button" to prevent form submission
              onClick={saveNote}
              className="bg-green-500 py-2 px-7 text-black rounded-md hover:bg-transparent border border-green-500 hover:text-green-500 duration-300 font-bold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
