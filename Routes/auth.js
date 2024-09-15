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
