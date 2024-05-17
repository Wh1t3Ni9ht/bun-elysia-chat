/*
  Routes:
  1. GET /friend/list
  2. GET /friend/:userId
  3. GET /friend/search/:usernameOrEmail (Search)
  4. GET /friend/request/:userId
  5. GET /friend/accept/:userId
  6. DELETE /friend/:userId
*/

import { Elysia, t } from "elysia";

import friendController from "./friend.controller";

const friends = new Elysia({ prefix: "/friend" })
  .get("/list", friendController.list)
  .get("/:userId", friendController.details)
  .get("/search/:usernameOrEmail", friendController.search)
  .get("/request/:userId", friendController.request)
  .get("/accept/:userId", friendController.accept)
  .delete("/:userId", friendController.remove);

export default friends;