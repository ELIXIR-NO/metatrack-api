import Elysia from "elysia";

export const dataHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/data",
	tags: ["data"],
})
	.get("/", async () => {})
	.get("/:dataId", async () => {})
	.post("/", async () => {})
	.put("/:dataId", async () => {})
	.delete("/:dataId", async () => {});
