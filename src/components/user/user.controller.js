import { User } from "./user.model";
import Preference from "../preference/preference.model";
import jwt from "jsonwebtoken";
import dbg from 'debug';

const debug = dbg('app');

const signup = async ({ body, cookie: { auth }, set }) => {
  try {
    const { username, email, password } = body;

    const user = await User.create({ username, email, password });

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET);

    auth.set({
      value: token,
      httpOnly: false,
      maxAge: 7 * 86400,
      path: '/',
    });

    await Preference.create({ user: user.id });

    set.status = 201;

    return {
      error: null,
      data: {
        message: "User created successfully",
        user: {
          username: user.username,
          email: user.email,
        },
      },
    };

  } catch (error) {
    debug("Name:", error.name)
    debug("Message:", error.message)
    debug("Error:", error)

    if (error.name === "MongoServerError" && error.code === 11000) {
      const key = Object.keys(error.keyValue)[0];

      set.status = 400;

      return {
        data: null,
        error: {
          name: "DUPLICATE_VALUE",
          message: `User with ${key} ${error.keyValue[key]} already exists`,
        },
      };
    }

    if (error.name === "ValidationError") {
      const keys = Object.keys(error.errors)

      set.status = 400;

      return {
        data: null,
        error: {
          name: "VALIDATION_ERROR",
          message: error.errors[keys[0]].message
        }
      }
    }

    set.status = 500;

    return {
      data: null,
      error: {
        name: error.name,
        message: error.message,
      },
    };
  }
}

const signin = async ({ body, cookie: { auth }, set }) => {
  try {
    const { usernameOrEmail, password } = body;

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      set.status = 401;

      return {
        data: null,
        error: {
          name: "UNAUTHORIZED",
          message: "incorrect credentials",
        },
      };
    }

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      set.status = 401;

      return {
        data: null,
        error: {
          name: "UNAUTHORIZED",
          message: "incorrect credentials",
        },
      }
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET);

    auth.set({
      value: token,
      httpOnly: false,
      maxAge: 7 * 86400,
      path: '/',
    });

    set.status = 200;

    return {
      error: null,
      data: {
        message: "You are signed in",
        user: {
          username: user.username,
          email: user.email
        },
      }
    };

  } catch (error) {
    debug("Name:", error.name)
    debug("Message:", error.message)
    debug("Error:", error)

    if (error.name === "JsonWebTokenError") {
      set.status = 400;

      return {
        data: null,
        error: {
          name: "UNAUTHORIZED",
          message: "incorrect credentials",
        },
      };
    }

    set.status = 500;

    return {
      data: null,
      error: {
        name: error.name,
        message: error.message,
      },
    };
  }
}

const signout = ({ cookie: { auth }, set }) => {
  auth.set({
    value: "",
    httpOnly: false,
    maxAge: 0,
    path: '/',
  })

  set.status = 200;

  return {
    error: null,
    data: {
      message: "You are signed out",
    },
  };
}

const profile = async ({ cookie: { auth }, set }) => {
  try {
    const token = auth.value;
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ username: jwtUser.username }, "-__v -password");

    set.status = 200;

    return {
      error: null,
      data: {
        user,
      },
    };
  } catch (error) {
    debug("Name:", error.name);
    debug("Message:", error.message);
    debug("Error:", error);

    if (error.name === "JsonWebTokenError") {
      set.status = 401;

      return {
        data: null,
        error: {
          name: "UNAUTHORIZED",
          message: "Unauthorized",
        },
      };
    }

    set.status = 500;

    return {
      data: null,
      error: {
        name: error.name,
        message: error.message,
      },
    };
  }
}

const deleteUser = async ({ cookie: { auth }, set }) => {
  try {
    const token = auth.value;
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneAndDelete({ username: jwtUser.username });

    auth.set({
      value: "",
      httpOnly: false,
      maxAge: 0,
      path: '/',
    })

    await Preference.findOneAndDelete({ user: jwtUser.id });

    set.status = 200;

    return {
      error: null,
      data: {
        message: "User deleted",
        user: {
          username: user.username,
          email: user.email
        },
      },
    };
  } catch (error) {
    debug("Name:", error.name);
    debug("Message:", error.message);
    debug("Error:", error);

    if (error.name === "JsonWebTokenError") {
      set.status = 401;

      return {
        data: null,
        error: {
          name: "UNAUTHORIZED",
          message: "Unauthorized",
        },
      };
    }

    set.status = 500;

    return {
      data: null,
      error: {
        name: error.name,
        message: error.message,
      },
    };
  }
}

export default {
  signup,
  signin,
  signout,
  profile,
  deleteUser
}