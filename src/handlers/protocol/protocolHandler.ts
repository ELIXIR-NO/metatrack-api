import Elysia from "elysia";

export const protocolHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/protocols",
	tags: ["protocol"],
})
	.get("/", async () => {})
	.get("/:protocolId", async () => {})
	.post("/", async () => {})
	.put("/:protocolId", async () => {})
	.delete("/:protocolId", async () => {});
