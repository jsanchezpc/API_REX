"use strict";
require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../middlewares/Auth");

const app = express();

app.get("/account/sync", Auth, async (req, res) => {
  const userId = req.body.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    // Usar la misma duración que en el login
    const tokenDurationInSeconds = parseInt(process.env.CAD_TOKEN.replace('s', ''));
    const tokenDurationInMs = tokenDurationInSeconds * 1000;

    const token = jwt.sign(
      { user: { _id: user._id, username: user.username } },
      process.env.SEED,
      { expiresIn: process.env.CAD_TOKEN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: tokenDurationInMs
    });

    res.json({
      ok: true,
      user: user,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      message: "Error al sincronizar usuario",
    });
  }
});

// user login
app.post("/account/login", (req, res) => {
  let body = req.body;
  User.findOne({ email: body.email })
    .then((userDb) => {
      if (!userDb) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Incorrect email or password",
          },
        });
      }

      if (!bcrypt.compareSync(body.password, userDb.password)) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Incorrect email or password",
          },
        });
      }
      // if (userDb.online === false) {
      //   userDb.online = true;
      // }

      // Convertir la duración del token de segundos a milisegundos para maxAge
      const tokenDurationInSeconds = parseInt(process.env.CAD_TOKEN.replace('s', ''));
      const tokenDurationInMs = tokenDurationInSeconds * 1000;

      let token = jwt.sign(
        {
          user: userDb,
        },
        process.env.SEED,
        { expiresIn: process.env.CAD_TOKEN }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: tokenDurationInMs
      });

      return res.json({
        ok: true,
        user: userDb
      });
    })
    .catch((err) => {
      return res.status(500).json({
        ok: false,
        err,
      });
    });
});

app.post("/account/logout", Auth, (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,   
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Strict', 
  });

  res.json({
    ok: true,
    message: "Sesión cerrada correctamente",
  });
});


// user signup
app.post("/account/create", (req, res) => {
  let body = req.body;
  // if (body.password !== body.repeatPassword) {
  //     return res.json({
  //         ok: false,
  //         error: "Password must match."
  //     })
  // }

  if (body.username == "" || body.username.length <= 1) {
    return res.json({
      ok: false,
      error: "Choose a longer username please.",
    });
  }

  if (!body.email || body.email.length <= 4) {
    res.json({
      ok: false,
      msg: "Wrong email",
    });
  }

  const check = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (body.password !== "" || body.password.match(check)) {

    let newUser = new User({
      username: body.username,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      language: body.language,
    });

    newUser.save().then((userDB) => {
      let token = jwt.sign(
        {
          ok: true,
          user: userDB,
        },
        process.env.SEED,
        { expiresIn: process.env.CAD_TOKEN }
      );

      // Convertir la duración del token de segundos a milisegundos para maxAge
      const tokenDurationInSeconds = parseInt(process.env.CAD_TOKEN.replace('s', ''));
      const tokenDurationInMs = tokenDurationInSeconds * 1000;

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: tokenDurationInMs
      });

      res.json({
        ok: true,
        user: userDB
      });
    })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          ok: false,
          err: err,
        });
      });
  } else {
    res.json({
      ok: false,
      err: "Wrong password!",
    });
  }
});

app.post("/account/update/skills", Auth, async (req, res) => {
  const { userId, role, skills, avatar } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    // Actualizamos los campos del usuario
    user.skills = skills;
    user.role = role;
    user.avatar = avatar;

    // Guardamos el usuario actualizado
    await user.save();

    // Generamos el token con el usuario actualizado
    let token = jwt.sign(
      {
        ok: true,
        user: user,
      },
      process.env.SEED,
      { expiresIn: process.env.CAD_TOKEN }
    );

    // Establecemos la cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Solo seguro en producción
      sameSite: 'Strict',
      maxAge: 2073600000  
    });

    res.json({
      ok: true,
      message: "Habilidades actualizadas correctamente",
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar habilidades",
    });
  }
});

module.exports = app;
