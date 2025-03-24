import Elysia from "elysia";

export const ontologySourceHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/ontologySources",
	tags: ["ontology-sources"],
})
	.get("/", async () => {})
	.get("/:ontologySourceId", async () => {})
	.post("/", async () => {})
	.put("/:ontologySourceId", async () => {})
	.delete("/:ontologySourceId", async () => {});
