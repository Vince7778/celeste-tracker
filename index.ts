import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("/*", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
