import Elysia from "elysia";

export const publicationHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/publications",
	tags: ["publication"],
})
	.get("/", async () => {})
	.get("/:publicationId", async () => {})
	.post("/", async () => {})
	.put("/:publicationId", async () => {})
	.delete("/:publicationId", async () => {});
