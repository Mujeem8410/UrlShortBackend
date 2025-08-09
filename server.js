import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";
import Url from "./models/Url.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));




// POST /api/shorten - create short URL
app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = nanoid(6);

  try {
    const newUrl = new Url({ longUrl, shortCode });
    await newUrl.save();

    const baseUrl ="https://urlshortbackend-2zcr.onrender.com";
    res.json({ shortUrl: `${baseUrl}/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
