import { Elysia } from "elysia";

import { assayHandler } from "./assayHandler";
import { assayMaterialHandler } from "./assayMaterialHandler";

export const assayHandlers = new Elysia()
	.use(assayHandler)
	.use(assayMaterialHandler);
