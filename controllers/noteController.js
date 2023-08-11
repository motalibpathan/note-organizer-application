const upload = require("../helpers/imageUpload");
const Note = require("../models/note");

// @desc    Create a new note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, photos } = req.body;

    // Create a new note in the database
    const newNote = await Note.create({
      user: req.userId,
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

    // Find the note by its ID in the database
    const existingNote = await Note.findById(id);
    if (!existingNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    // Update the note properties
    existingNote.title = title;
    existingNote.user = req.userId;
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

// @desc    Get filtered and paginated notes with search
// @route   GET /api/notes
exports.getAllNotesWithFilters = async (req, res) => {
  const perPage = 10; // Number of notes per page
  const page = parseInt(req.query.page) || 1; // Current page
  const searchText = req.query.searchText || ""; // Search text from query
  const categoryId = req.query.categoryId || null; // Category ID from query

  const query = {
    user: req.userId,
    $or: [
      { title: { $regex: searchText, $options: "i" } },
      { content: { $regex: searchText, $options: "i" } },
    ],
  };

  if (categoryId) {
    query.category = categoryId;
  }

  try {
    // Fetch filtered and paginated notes from the database
    const filteredNotes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    // Count total number of matching notes
    const totalCount = await Note.countDocuments(query);

    res.json({
      success: true,
      data: filteredNotes,
      pagination: {
        total: totalCount,
        current: page,
        perPage,
      },
    });
  } catch (error) {
    console.log("Error fetching notes:", error);
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
    console.log(
      "🚀 ~ file: noteController.js:109 ~ exports.getNoteById= ~ error:",
      error
    );
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
    console.log(
      "🚀 ~ file: noteController.js:136 ~ exports.deleteNote ~ error:",
      error
    );
    // Handle errors during note deletion
    res.status(500).json({
      success: false,
      message: "Error deleting note",
      error: error.message,
    });
  }
};
