import Elysia from "elysia";

export const processHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/processs",
	tags: ["process"],
})
	.get("/", async () => {})
	.get("/:processId", async () => {})
	.post("/", async () => {})
	.put("/:processId", async () => {})
	.delete("/:processId", async () => {});
