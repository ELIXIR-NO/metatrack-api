import Elysia from "elysia";

export const assayHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/studies/:studyId/assays",
	tags: ["assay"],
})
	.get("/", async () => {})
	.get("/:assayId", async () => {})
	.post("/", async () => {})
	.put("/:assayId", async () => {})
	.delete("/:assayId", async () => {});
