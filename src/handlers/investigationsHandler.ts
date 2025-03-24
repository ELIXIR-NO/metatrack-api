import Elysia from "elysia";

export const invetigationsHandler = new Elysia({
	prefix: "/projects/:projectId/investigations",
	tags: ["investigations"],
})
	.get("/", ({ params: { projectId } }) => projectId)
	.get("/:investigationId", () => {})
	.post("/", () => {})
	.put("/:investigationId", () => {})
	.delete("/:investigationId", () => {});
