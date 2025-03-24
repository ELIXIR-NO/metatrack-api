import Elysia from "elysia";

export const processParameterValueHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/processParameterValues",
	tags: ["process-parameter-value"],
})
	.get("/", async () => {})
	.get("/:processParameterValueId", async () => {})
	.post("/", async () => {})
	.put("/:processParameterValueId", async () => {})
	.delete("/:processParameterValueId", async () => {});
