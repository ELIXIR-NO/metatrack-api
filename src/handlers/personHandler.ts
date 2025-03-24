import Elysia from "elysia";

export const personHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/people",
	tags: ["person"],
})
	.get("/", async () => {})
	.get("/:personId", async () => {})
	.post("/", async () => {})
	.put("/:personId", async () => {})
	.delete("/:personId", async () => {});
