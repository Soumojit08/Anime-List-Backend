const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Anime = require("./models/anime");

const app = express();
const PORT = process.env.PORT || 5000;

const uri = `mongodb+srv://soumojit:root@anime.l2aiz.mongodb.net/`;

const corsOptions = {
  origin: "https://anime-list-rs7o.onrender.com", // Make sure to include the trailing slash
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Anime List API is running");
});

// Get all anime (split into planning and watched lists)
app.get("/anime", async (req, res) => {
  try {
    const planningList = await Anime.find({ status: "Planning" });
    const watchedList = await Anime.find({ status: "Watched" });
    res.json({ planningList, watchedList });
  } catch (error) {
    console.error("Error fetching anime:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add a new anime
app.post("/anime", async (req, res) => {
  const { title, imgSrc } = req.body;
  const newAnime = new Anime({ title, imgSrc, status: "Planning" });

  try {
    const savedAnime = await newAnime.save();
    res.status(201).json(savedAnime);
  } catch (error) {
    console.error("Error adding anime:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Move anime to "Watched"
app.put("/anime/:id/watched", async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    anime.status = "Watched";
    await anime.save();
    res.json(anime);
  } catch (error) {
    console.error("Error updating anime:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete an anime
app.delete("/anime/:id", async (req, res) => {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.json({ message: "Anime Deleted" });
  } catch (error) {
    console.error("Error deleting anime:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
