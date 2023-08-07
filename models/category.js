const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: true,
      minlength: [3, "Category name must be at least 3 characters long."],
      maxlength: [50, "Category name cannot exceed 50 characters."],
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot exceed 200 characters."],
    },
  },
  { timestamps: true }
);

const Category = model("Category", CategorySchema);

module.exports = Category;
