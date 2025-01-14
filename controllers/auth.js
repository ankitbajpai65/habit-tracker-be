const UserModel = require("../schema/user");
const jwt = require("jsonwebtoken");

const handleUserSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.json({
        status: "error",
        error: "All fields are required!",
      });
    }
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      return res.status(409).json({
        status: "error",
        error: "User already exists!",
      });
    }

    await UserModel.create({
      name,
      email,
      password,
    });
    return res.status(201).json({
      status: "ok",
      message: "User registered sucessfully!",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log({ email, password });

  try {
    const user = await UserModel.findOne({ email });
    // console.log(user);

    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    // if (user && (await bcrypt.compare(password, user.password))) {
    if (user.password === password) {
      const token = jwt.sign({ email }, process.env.TOKEN_KEY, {
        expiresIn: "24h",
      });
      user.token = token;

      //   res.cookie("access_token", token, {
      //     // domain: process.env.BASE_URL,
      //     //   path: "/",
      //     //   sameSite: "none",
      //     httpOnly: true,
      //     secure: true,
      //     expire: Date.now() + 2592000000,
      //   });

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          expire: Date.now() + 2592000000,
        })
        .status(200)
        .json({
          status: "ok",
          message: "Logged in successfully",
          token: token,
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
        });
    }
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Credentials" });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error });
  }
};

const handleUserLogout = (req, res) => {
  try {
    return res
      .clearCookie("access_token", {
        // path: "/",
        // sameSite: "none",
        httpOnly: true,
        secure: true,
        expire: Date.now() + 2592000000,
      })
      .json({ status: "ok", message: "Logged out successfully!" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", error: error });
  }
};

const getUserDetails = (req, res) => {
  const { user } = req;
  try {
    return res.status(200).json({
      status: "ok",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ status: "error", error: error });
  }
};

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
  getUserDetails,
};
