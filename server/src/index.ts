/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express";
import cors from "cors";
import { catchAsync } from "./utils";
import {
  checkSession,
  generateFigmaAuthUrl,
  generateKeys,
  handleFigmaOAuthCallback,
  pollForUserSession,
} from "./services";

const app = express();

app.use(cors());

app.get(
  "/generate-keys",
  catchAsync(async (req, res) => {
    const keys = await generateKeys();
    res.json(keys);
  })
);

app.get(
  "/auth",
  catchAsync(async (req, res) => {
    const { writeKey } = req.query;
    if (typeof writeKey !== "string") {
      return res.status(400).send("Invalid write key");
    }
    const figmaUrl = await generateFigmaAuthUrl(writeKey);
    res.redirect(figmaUrl);
  })
);

app.get(
  "/callback",
  catchAsync(async (req, res) => {
    try {
      const { code, state } = req.query;

      if (typeof code !== "string" || typeof state !== "string") {
        return res.status(400).send("Invalid request parameters");
      }

      await handleFigmaOAuthCallback(code, state);
      return res.send("Authentication complete! Please return to Figma.");
    } catch (error: any) {
      return res.status(error?.statusCode ?? 500).send(error?.message);
    }
  })
);

app.get(
  "/poll",
  catchAsync(async (req: Request, res: Response) => {
    try {
      const { readKey, writeKey } = req.query;
      if (typeof readKey !== "string")
        return res.status(400).send("Invalid read key");
      if (typeof writeKey !== "string")
        return res.status(400).send("Invalid write key");

      const userDetails = await pollForUserSession(readKey);
      if (!userDetails) {
        return res.status(404).send("Token not found. Please wait.");
      }
      return res.json(userDetails);
    } catch (error: any) {
      return res.status(error?.statusCode ?? 500).send(error?.message);
    }
  })
);

app.get(
  "/check-session",
  catchAsync(async (req, res) => {
    try {
      const { userId } = req.query;
      if (typeof userId !== "string")
        return res.status(400).send("Invalid user ID");

      const token = await checkSession(userId);
      return res.json({ token });
    } catch (error: any) {
      return res.status(error?.statusCode ?? 500).send(error?.message);
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
