import Elysia from "elysia";
import { projectsHandler } from "./project";

export const handlers = new Elysia().use(projectsHandler);
