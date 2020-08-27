const express = require("express");
const mongoose = require("mongoose");
const server = express();
server.use(express.json({}));
const MONGO_URI = "mongodb://localhost:27017/blogs";
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
const User = mongoose.model("User", userSchema);
server.get("/users/:email", (req, res) => {
  User.findOne({ email: req.params.email })
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch(() => {
      res.status(404);
      res.json({
        message: "No encuentro el usuario con ese id",
      });
    });
});
server.get("/users", (req, res) => {
  User.find({})
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch(() => {
      res.status(400);
      res.json({
        message: "No puedo regresar todos los usuarios",
      });
    });
});
server.post("/users", async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;
    const user = new User({ email, password, isAdmin });
    await user.save();
    res.json({
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({
      message: "No pudo crear el usuario",
    });
  }
});
server.put("/users/:id", async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        email,
        password,
        isAdmin,
      },
      {
        new: true,
      }
    );
    res.json({
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json({
      message: "No pudo crear el usuario",
    });
  }
});
server.listen(3000, () => {
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Is running!");
    })
    .catch((error) => {
      console.log("No nos pudimos conectar a mongo !!!!", error);
    });
});