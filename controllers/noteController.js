const upload = require("../helpers/imageUpload");
const Note = require("../models/note");

// @desc    Create a new note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, photos } = req.body;

    // Create a new note in the database
    const newNote = await Note.create({
      title,
      content,
      category: category || undefined,
      photos,
    });

    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    // Handle errors during note creation
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating note",
      error: error.message,
    });
  }
};

// @desc    Update a note by ID
// @route   PUT /api/notes/:id
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, photos } = req.body;
    console.log(
      "🚀 ~ file: noteController.js:36 ~ exports.updateNote= ~ photos:",
      photos
    );

    // Find the note by its ID in the database
    const existingNote = await Note.findById(id);
    if (!existingNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    // Update the note properties
    existingNote.title = title;
    existingNote.content = content;
    existingNote.category = category || undefined;

    // Update the photos array if new photos are provided
    if (photos) {
      existingNote.photos = photos;
    }

    // Save the updated note
    const updatedNote = await existingNote.save();

    res.json({ success: true, data: updatedNote });
  } catch (error) {
    // Handle errors during note update
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating note",
      error: error.message,
    });
  }
};

// @desc    Get all notes
// @route   GET /api/notes
exports.getAllNotes = async (req, res) => {
  try {
    // Fetch all notes from the database
    const allNotes = await Note.find().sort({ createdAt: -1 });
    res.json({ success: true, data: allNotes });
  } catch (error) {
    // Handle errors during note retrieval
    res.status(500).json({
      success: false,
      message: "Error fetching notes",
      error: error.message,
    });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
exports.getNoteById = async (req, res) => {
  try {
    // Find the note by its ID in the database
    const note = await Note.findById(req.params.id);
    if (!note) {
      // If note with the given ID is not found, return an error response
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    // Handle errors during note retrieval
    res.status(500).json({
      success: false,
      message: "Error fetching note",
      error: error.message,
    });
  }
};

// @desc    Delete a note by ID
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  try {
    // Find the note by its ID in the database and remove it
    const deletedNote = await Note.findByIdAndRemove(req.params.id);
    if (!deletedNote) {
      // If note with the given ID is not found, return an error response
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    // Handle errors during note deletion
    res.status(500).json({
      success: false,
      message: "Error deleting note",
      error: error.message,
    });
  }
};
