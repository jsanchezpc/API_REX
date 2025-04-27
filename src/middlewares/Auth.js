const jwt = require("jsonwebtoken");

let Auth = (req, res, next) => {
  try {
    const token = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1];
    if (!token) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "No valid token provided",
        },
      });
    }

    jwt.verify(token, process.env.SEED, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          ok: false,
          err: {
            message: "Invalid token",
          },
        });
      }

      req.body.user = decoded.user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      err: {
        message: "Server error",
      },
    });
  }
};

module.exports = Auth;
