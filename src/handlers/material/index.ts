import Elysia from "elysia";
import { materialAttributeHandler } from "./materialAttributeHandler";
import { materialAttributeValueHandler } from "./materialAttributeValueHandler";
import { materialHandler } from "./materialHandler";

export const materialHandlers = new Elysia()
	.use(materialAttributeHandler)
	.use(materialAttributeValueHandler)
	.use(materialHandler);
