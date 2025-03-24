import Elysia from "elysia";

export const factorValueHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/factor/:factorId/factor-value",
	tags: ["factor-value"],
})
	.get("/", async () => {})
	.get("/:factorValueId", async () => {})
	.post("/", async () => {})
	.put("/:factorValueId", async () => {})
	.delete("/:factorValueId", async () => {});
