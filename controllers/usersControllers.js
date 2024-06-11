import usersService from "../services/usersServices.js";
import schema from "../schemas/usersSchemas.js";
import * as fs from "fs/promises";
import path from "node:path";
import Jimp from "jimp";

export const register = async (req, res, next) => {
  try {
    const { error } = schema.createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    } else {
      const { password, email, subscription = "starter" } = req.body;
      const result = await usersService.registerUser({
        password,
        email,
        subscription,
      });
      if (result === null) {
        return res.status(409).send({ message: "Email in use" });
      }
      return res.status(201).send({
        user: {
          email: result.email,
          subscription: result.subscription,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = schema.loginUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    } else {
      const { password, email } = req.body;
      const result = await usersService.loginUser(email, password);
      if (result === null) {
        return res.status(401).send({ message: "Email or password is wrong" });
      }
      return res.status(200).send({
        token: result.token,
        user: {
          email: result.user.email,
          subscription: result.user.subscription,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await usersService.logoutUser(req.user.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const result = usersService.currentUser(authorizationHeader);
    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { error } = schema.updateSubscriptionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    } else {
      const subscription = req.body.subscription;
      const id = req.user.id;
      const result = await usersService.updateSubscriptionUser(
        id,
        subscription
      );

      return res.status(200).send(result);
    }
  } catch (error) {
    next(error);
  }
};

export const getAvatar = async (req, res, next) => {
  const id = req.user.id;

  try {
    const userAvatarFilePath = await usersService.getUserAvatar(id);

    const isStatic = await fs
      .access(userAvatarFilePath)
      .then(() => true)
      .catch(() => false);

    if (isStatic) {
      return res
        .status(200)
        .send({ avatarURL: "/avatars/" + userAvatarFilePath });
    } else {
      return res.status(200).send({ avatarURL: userAvatarFilePath });
    }
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const id = req.user.id;
    await fs.rename(
      req.file.path,
      path.resolve("public", "avatars", req.file.filename)
    );

    Jimp.read(
      path.resolve("public", "avatars", req.file.filename),
      (err, avatar) => {
        if (err) throw err;
        avatar
          .resize(256, 256)
          .quality(60)
          .write(path.resolve("public", "avatars", req.file.filename));
      }
    );
    const avatarURL = await usersService.updateUserAvatar(
      id,
      req.file.filename
    );

    return res.status(200).send({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  current,
  updateSubscription,
  getAvatar,
  updateAvatar,
};
