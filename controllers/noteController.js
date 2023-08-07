const Note = require("../models/note");

// @desc    Create a new note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Use the upload middleware to handle image uploads
    upload.array("photos")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error uploading images",
          error: err.message,
        });
      }

      // Get the filenames and original names of the uploaded images from req.files
      const photos = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
      }));

      // Create a new note in the database
      const newNote = await Note.create({ title, content, category, photos });

      res.status(201).json({ success: true, data: newNote });
    });
  } catch (error) {
    // Handle errors during note creation
    res.status(500).json({
      success: false,
      message: "Error creating note",
      error: error.message,
    });
  }
};

// @desc    Get all notes
// @route   GET /api/notes
exports.getAllNotes = async (req, res) => {
  try {
    // Fetch all notes from the database
    const allNotes = await Note.find();
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

// @desc    Update a note by ID
// @route   PUT /api/notes/:id
exports.updateNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Find the note by its ID in the database
    let note = await Note.findById(req.params.id);
    if (!note) {
      // If note with the given ID is not found, return an error response
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    // Use the upload middleware to handle image uploads
    upload.array("photos")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error uploading images",
          error: err.message,
        });
      }

      // Get the filenames and original names of the uploaded images from req.files
      const uploadedPhotos = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
      }));

      // Determine which images to keep and which to remove
      let updatedPhotos;
      if (uploadedPhotos.length > 0) {
        // Add new images to the existing ones
        updatedPhotos = [...note.photos, ...uploadedPhotos];
      } else {
        // Keep the existing images
        updatedPhotos = note.photos;
      }

      // Update the note with the new data, including the updated photos array
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { title, content, category, photos: updatedPhotos },
        { new: true }
      );

      res.json({ success: true, data: note });
    });
  } catch (error) {
    // Handle errors during note update
    res.status(500).json({
      success: false,
      message: "Error updating note",
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
