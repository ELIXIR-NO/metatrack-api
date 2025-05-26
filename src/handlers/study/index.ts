import Elysia from "elysia";

import { studyHandler } from "./studyHandler";
import { studyMaterialHandler } from "./studyMaterialHandler";

export const studyHandlers = new Elysia()
	.use(studyHandler)
	.use(studyMaterialHandler);
