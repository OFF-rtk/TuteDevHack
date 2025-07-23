import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// if (!process.env.SECRET_KEY) {
//   console.error("❌ SECRET_KEY not defined in .env file");
//   process.exit(1);
// }

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});