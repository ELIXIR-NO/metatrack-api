import Elysia from "elysia";
import { projectsHandler } from "./projectHandler";

export const handlers = new Elysia().use(projectsHandler);
