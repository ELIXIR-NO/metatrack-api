import Elysia from "elysia";
import { protocolParameterHandler } from "./protocolParameterHandler";
import { protocolHandler } from "./protocolHandler";

export const protocolHandlers = new Elysia()
	.use(protocolParameterHandler)
	.use(protocolHandler);
