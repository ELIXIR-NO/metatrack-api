import Elysia from "elysia";
import { processParameterValueHandler } from "./processParameterValueHandler";
import { processHandler } from "./processHandler";

export const processHandlers = new Elysia()
	.use(processParameterValueHandler)
	.use(processHandler);
