import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

const registerUser = async (credentials) => {
  try {
    const { password, email, subscription } = credentials;

    const user = await User.findOne({ email });
    if (user !== null) {
      return null;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: passwordHash,
      subscription,
      avatarURL: gravatar.url(email),
    });
    return newUser;
  } catch (error) {}
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (user === null) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return null;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, subscription: user.subscription },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await User.findByIdAndUpdate(user._id, { token });

    return { token, user };
  } catch (error) {}
};
const logoutUser = async (id) => {
  await User.findByIdAndUpdate(id, { token: null });
};

const currentUser = (authorizationHeader) => {
  const token = authorizationHeader.split(" ")[1];

  const { subscription, email } = jwt.decode(token);
  return { email, subscription };
};

const updateSubscriptionUser = async (id, subscription) => {
  try {
    const data = await User.findByIdAndUpdate(
      id,
      { subscription },
      {
        new: true,
      }
    );
    return data;
  } catch (error) {}
};

const getUserAvatar = async (id) => {
  try {
    const user = await User.findById(id);

    return user.avatarURL;
  } catch (error) {}
};

const updateUserAvatar = async (id, filename) => {
  try {
    const data = await User.findByIdAndUpdate(
      id,
      { avatarURL: "/avatars/" + filename },
      {
        new: true,
      }
    );
    return data.avatarURL;
  } catch (error) {}
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscriptionUser,
  getUserAvatar,
  updateUserAvatar,
};
