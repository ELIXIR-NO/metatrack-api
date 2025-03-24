import Elysia from "elysia";

import { factorValueHandler } from "./favtorValueHandler";
import { factorHandler } from "./factorHandler";

export const factorHandlers = new Elysia()
	.use(factorHandler)
	.use(factorValueHandler);
