import Elysia from "elysia";

export const ontologyAnnotationHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/ontologyAnnotations",
	tags: ["ontology-annotation"],
})
	.get("/", async () => {})
	.get("/:ontologyAnnotationId", async () => {})
	.post("/", async () => {})
	.put("/:ontologyAnnotationId", async () => {})
	.delete("/:ontologyAnnotationId", async () => {});
