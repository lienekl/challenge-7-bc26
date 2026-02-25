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

// TODO:  Serve static files from the 'public' directory - always we need to use this to serve file in public directory.
app.use(express.static(path.join(__dirname, "public")));

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file
const readData = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// TODO: Handle GET request at the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
    const data = readData();
    res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
    const newData = { id: uuidv4(), ...req.body };
    const currentData = readData();
    currentData.push(newData);
    writeData(currentData);
    res.json({ message: "Data saved successfully", data: newData });
});

// Handle GET request to retrieve data by ID
app.get("/data/:id", (req, res) => {
    const data = readData();
    const item = data.find((item) => item.id === req.params.id);
    if (!item) {
        return res.status(404).json({ message: "Data not found" });
    }
    res.json(item);
});

// TODO: Handle PUT request to update data by ID
app.put("/data/:id", (req, res) => {
    const data = readData();
    const item = data.find((item) => item.id === req.params.id);
    if (!item) {
        return res.status(404).json({ message: "Data not found" });
    }
    item.note = req.body.note; //we want to updated item.name (name is the variable that containes the text in data.json file("name": "test2"). it can also be a note r message... anyhting. )updated the note if provided
    writeData(data);

    res.json(item);
});


// TODO: Handle DELETE request to delete data by ID
app.delete("/data/:id", (req, res) => {
    const data = readData();
    const index = data.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Data not found" });
    }
    const deletedItem = data.splice(index, 1)[0]; //Remove the item from the array
    writeData(data); //Write the updated data back to the file.

    res.jsonp({ message: "Data deleted successfully", data: deletedItem });
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
    // Respond with the same data that was received in the request body
    res.json({ received: req.body });
});

// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
