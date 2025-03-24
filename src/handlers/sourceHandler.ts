import Elysia from "elysia";

export const sourceHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/sources",
	tags: ["sources"],
})
	.get("/", async () => {})
	.get("/:sourceId", async () => {})
	.post("/", async () => {})
	.put("/:sourceId", async () => {})
	.delete("/:sourceId", async () => {});
