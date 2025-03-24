import Elysia from "elysia";

export const materialHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/materials",
	tags: ["materials"],
})
	.get("/", async () => {})
	.get("/:materialId", async () => {})
	.post("/", async () => {})
	.put("/:materialId", async () => {})
	.delete("/:materialId", async () => {});
