import Elysia from "elysia";

export const sampleHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/samples",
	tags: ["sample"],
})
	.get("/", async () => {})
	.get("/:sampleId", async () => {})
	.post("/", async () => {})
	.put("/:sampleId", async () => {})
	.delete("/:sampleId", async () => {});
