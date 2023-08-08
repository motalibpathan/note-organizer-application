const express = require("express");
const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} = require("../controllers/categoryController");

const router = express.Router();

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @return  {Object} - Returns an object with the success status and an array of all categories.
 */
router.get("/", getAllCategories);

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @body    {String} name - The name of the category (required).
 * @body    {String} description - The description of the category (optional).
 * @return  {Object} - Returns an object with the success status and the newly created category.
 */
router.post("/", createCategory);

/**
 * @desc    Get a single category by ID
 * @route   GET /api/categories/:id
 * @params  {String} id - The ID of the category to retrieve.
 * @return  {Object} - Returns an object with the success status and the category data.
 */
router.get("/:id", getCategoryById);

/**
 * @desc    Update a category by ID
 * @route   PUT /api/categories/:id
 * @params  {String} id - The ID of the category to update.
 * @body    {String} name - The updated name of the category (required).
 * @body    {String} description - The updated description of the category (optional).
 * @return  {Object} - Returns an object with the success status and the updated category data.
 */
router.put("/:id", updateCategory);

/**
 * @desc    Delete a category by ID
 * @route   DELETE /api/categories/:id
 * @params  {String} id - The ID of the category to delete.
 * @return  {Object} - Returns an object with the success status and a message indicating successful deletion.
 */
router.delete("/:id", deleteCategory);

module.exports = router;
