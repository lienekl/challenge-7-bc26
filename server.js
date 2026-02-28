// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = 3001;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define the path to the JSON file
const noteFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file
const readNote = () => {
    if (!fs.existsSync(noteFilePath)) {
        return [];
    }
    const note = fs.readFileSync(noteFilePath);
    return JSON.parse(note);
};

// Function to write data to the JSON file
const writeNote = (note) => {
    fs.writeFileSync(noteFilePath, JSON.stringify(note, null, 2));
};

// Handle GET request at the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle GET request to retrieve stored data
app.get("/note", (req, res) => {
    const note = readNote();
    res.json(note);
});

// Handle POST request to save new data with a unique ID
app.post("/note", (req, res) => {
    const newNote = { id: uuidv4(), ...req.body };
    const currentNote = readNote();
    currentNote.push(newNote);
    writeNote(currentNote);
    res.json({ message: "Note saved successfully", note: newNote });
});

// Handle GET request to retrieve data by ID
app.get("/note/:id", (req, res) => {
    const note = readNote();
    const item = note.find((item) => item.id === req.params.id);
    if (!item) {
        return res.status(404).json({ message: "Note not found" });
    }
    res.json(item);
});

// Handle PUT request to update data by ID
app.put("/note/:id", (req, res) => {
    const note = readNote();
    const item = note.find((item) => item.id === req.params.id);
    if (!item) {
        return res.status(404).json({ message: "Note not found" });
    }
    item.note = req.body.note; 
    writeNote(note);
    res.json(item);
});


// Handle DELETE request to delete data by ID
app.delete("/note/:id", (req, res) => {
    const note = readNote();
    const index = note.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Note not found" });
    }
    const deletedItem = note.splice(index, 1)[0]; 
    writeNote(note); 
    res.json({ message: "Note deleted successfully", note: deletedItem });
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
    // Respond with the same data that was received in the request body
    res.json({ received: req.body });
});

// Wildcard route to handle undefined routes
app.all("(.*)", (req, res) => {
    res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
