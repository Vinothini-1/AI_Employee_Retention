import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./Database/dbConfig.js";
import userRouter from "./Routers/user.router.js";
import attendanceRouter from "./Routers/attendance.router.js";
import projectRouter from "./Routers/project.router.js";
import "./Schedulers/AttendanceScheduler.js";
import path from 'path';
import { fileURLToPath } from 'url';



dotenv.config();

//express cofiguration
const app = express();
app.use(cors());
app.use(express.json());

//db connection
dbConnect();

app.get("/", (req, res) => {
  res.status(200).json({ message: "App is working fine" });
});

//routes configuration
app.use("/api/user", userRouter);
app.use("/api/user/attendance", attendanceRouter);
app.use("/api/user/project", projectRouter);

//Convert `import.meta.url` to the equivalent of `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the uploads folder where images are stored
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Make sure role is included
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

