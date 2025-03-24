import Elysia from "elysia";

export const materialAttributeValueHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/materialAttributeValues",
	tags: ["material-attribute-values"],
})
	.get("/", async () => {})
	.get("/:materialAttributeValueId", async () => {})
	.post("/", async () => {})
	.put("/:materialAttributeValueId", async () => {})
	.delete("/:materialAttributeValueId", async () => {});
