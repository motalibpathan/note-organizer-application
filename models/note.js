const { Schema, model } = require("mongoose");

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      minlength: [3, "Title must be at least 3 characters long."],
      maxlength: [100, "Title cannot exceed 100 characters."],
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      minlength: [10, "Content must be at least 10 characters long."],
      maxlength: [1000, "Content cannot exceed 1000 characters."],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    photos: [
      {
        filename: {
          type: String,
          required: [true, "Photo filename is required."],
        },
        originalName: {
          type: String,
          required: [true, "Photo original name is required."],
        },
      },
    ],
  },
  { timestamps: true }
);

const Note = model("Note", NoteSchema);

module.exports = Note;
