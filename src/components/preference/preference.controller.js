/*
  Functions:
  1. list
  2. update
*/
import Preference from "./preference.model";
import jwt from "jsonwebtoken";
import dbg from "debug";

const debug = dbg("app");

const list = async ({ cookie: { auth }, set }) => {
  try {
    const token = auth.value;
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    const preference = await Preference.findOne({ user: jwtUser.id });

    if (!preference) {
      set.status = 401;

      const e = new Error("Unauthorized");
      e.name = "UNAUTHORIZED";
      throw e;
    }

    set.status = 200;

    return {
      error: null,
      data: {
        preference,
      },
    };
  } catch (error) {
    debug("Name:", error.name);
    debug("Message:", error.message);
    debug("Error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "UNAUTHORIZED") {
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

const update = async ({ body, cookie: { auth }, set }) => {
  try {
    const { emailVisibility, onlineStatusVisibility, locationVisibility, bioVisibility, lastSeenVisibility, profilePictureVisibility, twoFactorAuthentication, readReceipts } = body;
    const token = auth.value;
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    const preference = await Preference.findOneAndUpdate({ user: jwtUser.id }, {
      emailVisibility,
      onlineStatusVisibility,
      locationVisibility,
      bioVisibility,
      lastSeenVisibility,
      profilePictureVisibility,
      twoFactorAuthentication,
      readReceipts
    }, { new: true });

    if (!preference) {
      set.status = 401;

      const e = new Error("Unauthorized");
      e.name = "UNAUTHORIZED";
      throw e;
    }

    set.status = 200;

    return {
      error: null,
      data: {
        preference,
      },
    }
  } catch (error) {
    debug("Name:", error.name);
    debug("Message:", error.message);
    debug("Error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "UNAUTHORIZED") {
      set.status = 401;

      return {
        data: null,
        error: {
          name: "UNAUTHORIZED",
          message: "Unauthorized",
        },
      }
    }

    set.status = 500;

    return {
      data: null,
      error: {
        name: error.name,
        message: error.message,
      },
    }
  }
}
export default {
  list,
  update,
}