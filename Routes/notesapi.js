// const notesModel = require("../Models/notes");
// const router = require("express").Router();
// const jwt = require("jsonwebtoken");
// const userModel = require("../Models/user");

// const isloggedin = async (req, res, next) => {
//   try {
//     let token = await req.cookies.token;
//     if (!token) return res.status(401).json({ message: "Unauthorized" });
//     const decoded = jwt.verify(token, process.env.SECRET);
//     req.user = decoded;
//     next();
//   } catch (e) {
//     res.status(500).send({ success: false, message: e.message });
//   }
// };

// // create the notes
// router.post("/createnotes", isloggedin, async (req, res) => {
//   try {
//     let { title, discription } = req.body;
//     let user = req.user.user;
//     let newNotes = await notesModel.create({
//       title: title,
//       discription: discription,
//       user: user,
//     });

//     if (!newNotes) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Failed to create notes" });
//     }
//     res.status(200).send({ success: true, data: newNotes });
//   } catch (e) {
//     res.status(500).send({ success: false, message: "Error creating notes" });
//   }
// });
// // updating the notes

// router.post("/updatenotes/:id", isloggedin, async (req, res) => {
//   try {
//     let { modifiedContent } = req.body;
//     let noteId = req.params.id;
//     let note = await notesModel.findOne({ _id: noteId });
//     if (!note) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Notes not found" });
//     }

//     Object.keys(modifiedContent).forEach((key) => {
//       note[key] = modifiedContent[key];
//     });

//     await note.save();

//     res.status(200).send({
//       success: true,
//       data: note,
//     });
//   } catch (e) {
//     res.status(500).send({ success: false, message: e.message });
//   }
// });

// // deleting the notes

// router.delete("/deletenotes/:id", isloggedin, async (req, res) => {
//   try {
//     let noteId = req.params.id;
//     let note = await notesModel.findByIdAndDelete(noteId);
//     if (!note) {
//       return res
//         .status(404)
//         .send({ success: false, message: "Notes not found" });
//     }
//     res
//       .status(200)
//       .send({ success: true, message: "Notes deleted successfully" });
//   } catch (e) {
//     res.status(500).send({ success: false, message: e.message });
//   }
// });

// // getting all the notes

// router.get("/getnotes", isloggedin, async (req, res) => {
//   try {
//     let user = await userModel.findById(req.user.user);
//     let notes = await notesModel.find({ user: user });
//     if (!notes) {
//       return res
//         .status(404)
//         .send({ success: false, message: "Notes not found" });
//     }
//     res.status(200).send({ success: true, data: notes });
//   } catch (e) {
//     res.status(500).send({ success: false, message: e.message });
//   }
// });

// module.exports = router;

const router = require("express").Router();
const userModel = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User does not exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ user: user._id, email }, process.env.SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .send({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ user: newUser._id, email }, process.env.SECRET);
    res.cookie("token", token, { httpOnly: true });
    res
      .status(200)
      .send({ success: true, message: "User created successfully", token });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ success: true, message: "Logged out successfully" });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
});

module.exports = router;

