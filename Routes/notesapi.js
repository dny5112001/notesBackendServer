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

const notesModel = require("../Models/notes");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");

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

const islogged = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
};

// create the notes
router.post("/createnotes", islogged, async (req, res) => {
  try {
    let { title, discription } = req.body;
    let user = req.user.user;
    let newNotes = await notesModel.create({
      title: title,
      discription: discription,
      user: user,
    });

    if (!newNotes) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to create notes" });
    }
    res.status(200).send({ success: true, data: newNotes });
  } catch (e) {
    res.status(500).send({ success: false, message: "Error creating notes" });
  }
});
// updating the notes

router.put("/updatenotes/:id", islogged, async (req, res) => {
  try {
    let { modifiedContent } = req.body;
    let noteId = req.params.id;
    let note = await notesModel.findOne({ _id: noteId });
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Notes not found" });
    }

    Object.keys(modifiedContent).forEach((key) => {
      note[key] = modifiedContent[key];
    });

    await note.save();

    res.status(200).send({
      success: true,
      data: note,
    });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});

// deleting the notes

router.delete("/deletenotes/:id", islogged, async (req, res) => {
  try {
    let noteId = req.params.id;
    let note = await notesModel.findByIdAndDelete(noteId);
    if (!note) {
      return res
        .status(404)
        .send({ success: false, message: "Notes not found" });
    }
    res
      .status(200)
      .send({ success: true, message: "Notes deleted successfully" });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});

// getting all the notes

router.get("/getnotes", islogged, async (req, res) => {
  try {
    let user = await userModel.findById(req.user.user);
    let notes = await notesModel.find({ user: user });
    if (!notes) {
      return res
        .status(404)
        .send({ success: false, message: "Notes not found" });
    }
    res.status(200).send({ success: true, data: notes });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});


module.exports = router;

