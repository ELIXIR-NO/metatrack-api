import Elysia from "elysia";
import { ontologySourceHandler } from "./ontologySourceHandler";
import { ontologyAnnotationHandler } from "./ontologyAnnotationHandler";

export const ontologyHandlers = new Elysia()
	.use(ontologyAnnotationHandler)
	.use(ontologySourceHandler);
