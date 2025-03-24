import Elysia from "elysia";

export const factorHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/factor",
	tags: ["factor"],
})
	.get("/", async () => {})
	.get("/:factorId", async () => {})
	.post("/", async () => {})
	.put("/:factorId", async () => {})
	.delete("/:factorId", async () => {});
