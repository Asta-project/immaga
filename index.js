const express = require("express");
const app = express();
const got = require("got");

const apiKey = "acc_e9ec51afb30cd9a";
const apiSecret = "b0a5520a013c3912ecd8e4a7a08bec4a";

app.use(express.json());

app.post("/api/generate", async (req, res) => {
  try {
    const { promptText, imageURLs } = req.body;

    if (!promptText && !imageURLs) {
      res.status(400).json({ error: "Missing prompt text or image URL" });
      return;
    }

    let imageData = null;
    if (imageURLs && imageURLs.length > 0) {
      imageData = await tagImage(imageURLs[0]);
    }

    const result = generateText(promptText, imageData);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function tagImage(imageUrl) {
  try {
    const url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(
      imageUrl
    )}`;
    const response = await got(url, { username: apiKey, password: apiSecret });
    const data = JSON.parse(response.body);
    return data.result.tags;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function generateText(promptText, imageData) {
  // TO DO: implement text generation logic using promptText and imageData
  // For now, return a simple response
  if (promptText) {
    return `Generated text based on prompt: ${promptText}`;
  } else if (imageData) {
    return `Generated text based on image tags: ${imageData
      .map((tag) => tag.confidence)
      .join(", ")}`;
  } else {
    return "No prompt text or image data provided";
  }
}

const port = 3000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
