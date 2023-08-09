const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: [true, "Category name must be unique."],
      minlength: [3, "Category name must be at least 3 characters long."],
      maxlength: [50, "Category name cannot exceed 50 characters."],
    },
  },
  { timestamps: true }
);

const Category = model("Category", CategorySchema);

module.exports = Category;
