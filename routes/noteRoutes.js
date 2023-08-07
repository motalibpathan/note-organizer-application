const {
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
  createNote,
} = require("../controllers/noteController");

const express = require("express");

const router = express.Router();

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @param   {object} req.body - The request body containing the note data
 * @return  {object} The newly created note in the response body
 */
router.post("/", createNote);

/**
 * @route   GET /api/notes
 * @desc    Get all notes
 * @return  {object[]} An array of all notes in the response body
 */
router.get("/", getAllNotes);

/**
 * @route   GET /api/notes/:id
 * @desc    Get a single note by ID
 * @param   {string} id - The ID of the note to retrieve
 * @return  {object} The note with the specified ID in the response body
 */
router.get("/:id", getNoteById);

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note by ID
 * @param   {string} id - The ID of the note to update
 * @param   {object} req.body - The request body containing the updated note data
 * @return  {object} The updated note in the response body
 */
router.put("/:id", updateNote);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note by ID
 * @param   {string} id - The ID of the note to delete
 * @return  {object} A success message in the response body if the note is deleted successfully
 */
router.delete("/:id", deleteNote);

module.exports = router;
