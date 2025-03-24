import Elysia from "elysia";

export const studyHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/studies",
	tags: ["study"],
})
	.get("/", async () => {})
	.get("/:studyId", async () => {})
	.post("/", async () => {})
	.put("/:studyId", async () => {})
	.delete("/:studyId", async () => {});
