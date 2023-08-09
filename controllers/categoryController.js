// @desc    Get all categories

const Category = require("../models/category");

// @route   GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    // Fetch all categories from the database
    const allCategories = await Category.find();
    res.json({ success: true, data: allCategories });
  } catch (error) {
    console.log(
      "🚀 ~ file: categoryController.js:12 ~ exports.getAllCategories= ~ error:",
      error
    );
    // Handle errors during category retrieval
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required." });
    }

    // Create a new category in the database
    const newCategory = await Category.create({ name });

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.log(
      "🚀 ~ file: categoryController.js:39 ~ exports.createCategory= ~ error:",
      error
    );
    // Handle errors during category creation
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    // Find the category by its ID in the database
    const category = await Category.findById(req.params.id);
    if (!category) {
      // If category with the given ID is not found, return an error response
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    console.log(
      "🚀 ~ file: categoryController.js:63 ~ exports.getCategoryById= ~ error:",
      error
    );
    // Handle errors during category retrieval
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

// @desc    Update a category by ID
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required." });
    }

    // Find the category by its ID in the database and update it
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedCategory) {
      // If category with the given ID is not found, return an error response
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.log(
      "🚀 ~ file: categoryController.js:99 ~ exports.updateCategory= ~ error:",
      error
    );
    // Handle errors during category update
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    // Find the category by its ID in the database and remove it
    const deletedCategory = await Category.findByIdAndRemove(req.params.id);
    if (!deletedCategory) {
      // If category with the given ID is not found, return an error response
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.log(
      "🚀 ~ file: categoryController.js:123 ~ exports.deleteCategory ~ error:",
      error
    );
    // Handle errors during category deletion
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};
