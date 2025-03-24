import Elysia from "elysia";

export const protocolParameterHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/protocolParameters",
	tags: ["protocol-parameter"],
})
	.get("/", async () => {})
	.get("/:protocolParameterId", async () => {})
	.post("/", async () => {})
	.put("/:protocolParameterId", async () => {})
	.delete("/:protocolParameterId", async () => {});
