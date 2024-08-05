import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.static("."));
app.use(express.json());

app.post("/upgrade", async (req, res) => {
  const { email, amount } = req.body;

  if (!email || amount === undefined) {
    return res
      .status(400)
      .json({ error: "Email and amount are required", request: req.body });
  }

  try {
    const response = await axios.post(
      "https://us-central1-kalaam-25610.cloudfunctions.net/updateUserDonationInfoByEmail",
      {
        email,
        amount,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY,
        },
      }
    );

    console.log("Upgrade successful for email:", email, "amount:", amount);
    res.json({
      success: true,
      message: response.data,
    });
  } catch (error) {
    console.error("Error:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({ error: "Service unavailable" });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
