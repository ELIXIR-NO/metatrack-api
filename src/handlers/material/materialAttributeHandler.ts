import Elysia from "elysia";

export const materialAttributeHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/materialAttributes",
	tags: ["material-attributes"],
})
	.get("/", async () => {})
	.get("/:materialAttributeId", async () => {})
	.post("/", async () => {})
	.put("/:materialAttributeId", async () => {})
	.delete("/:materialAttributeId", async () => {});
