/*
  Functions:
  1. list
  2. update
*/
import { User } from "../user/user.model";
import jwt from "jsonwebtoken";
import dbg from "debug";

const debug = dbg("app");

const list = async ({ cookie: { auth }, set }) => {
  try {
    const token = auth.value;
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(jwtUser.id, "-__v -password");

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

export default {
  list,
}