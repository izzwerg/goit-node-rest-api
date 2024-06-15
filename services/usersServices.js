import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import mail from "../mail.js";
import crypto from "node:crypto";

const registerUser = async (credentials) => {
  try {
    const { password, email, subscription } = credentials;

    const user = await User.findOne({ email });
    if (user !== null) {
      return null;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();
    mail.sendMail({
      to: email,
      subject: "Welcome to the our awesome site",
      html: `
        <h1>Welcome to the our wonderful site</h1>
        <p>Please click on the link to verify your email</p>
        <a href="http://localhost:3000/api/users/verify/${verificationToken}">
          Link</a>`,
      text: `Welcome to the our wonderful site
        Please click on the link to verify your email
        http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    const newUser = await User.create({
      email,
      password: passwordHash,
      subscription,
      avatarURL: gravatar.url(email),
      verificationToken,
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

    if (!user.verify) {
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

const verifyUser = async (verificationToken) => {
  try {
    const user = await User.findOne({ verificationToken });
    if (user == null) return null;

    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });

    return true;
  } catch (error) {}
};

const sendVerificationEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (user == null) return null;
    if (user.verify === true) return true;

    mail.sendMail({
      to: email,
      subject: "Welcome to the our awesome site",
      html: `
        <h1>Welcome to the our wonderful site</h1>
        <p>Please click on the link to verify your email</p>
        <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">
          Link</a>`,
      text: `Welcome to the our wonderful site
        Please click on the link to verify your email
        http://localhost:3000/api/users/verify/${user.verificationToken}`,
    });
    return user;
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
  verifyUser,
  sendVerificationEmail,
};
