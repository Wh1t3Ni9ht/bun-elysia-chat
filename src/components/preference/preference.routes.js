/*
  Routes:
  1. GET /preference/list
  2. POST /preference/update
*/

import { Elysia, t } from "elysia";

import preferenceController from './preference.controller';

const preferences = new Elysia({ prefix: "/preference" })
.get("/list", preferenceController.list)
.post("/update", preferenceController.update);

export default preferences;