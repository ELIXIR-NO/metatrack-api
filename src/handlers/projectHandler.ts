import { Elysia, t } from "elysia";
import { auth } from "../utils/auth";

import {
	createProject,
	deleteProject,
	getAllProjects,
	getProjectById,
	getUserRole,
	updateProject,
} from "../lib/project";

export const projectsHandler = new Elysia({
	prefix: "/projects",
	tags: ["projects"],
})
	.get("/", async (ctx) => await getAllProjects())
	.get(
		"/:id",
		async ({ error, params: { id } }) => {
			const result = await getProjectById(id);
			if (!result) return error(404, "Not Found");

			return result;
		},
		{
			detail: {
				responses: {
					200: {
						description: "Project found",
					},
					404: {
						description: "Project not found",
					},
				},
			},
		},
	)
	.post(
		"/",
		async ({ set, request, body: { name, description }, error }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.user) return error(401, "Unauthorized");

			const userId = session.user.id;
			try {
				await createProject(userId, name, description);
			} catch (err) {
				if (err instanceof Error) return error(500, err.message);
			}

			set.status = "Created";
		},
		{
			detail: {
				responses: {
					201: {
						description: "Project created",
					},
					400: {
						description: "Bad request",
					},
					401: {
						description: "Unauthorized",
					},
				},
			},
			body: t.Object({
				name: t.String(),
				description: t.Optional(t.String()),
			}),
		},
	)
	.put(
		"/:id",
		async ({ set, request, params: { id }, body, error }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const userId = session.user.id;
			const project = await getProjectById(id);
			if (!project) return error(404, "Not Found");

			try {
				const userRole = await getUserRole(id, userId);
				if (userRole !== "owner") return error(403, "Forbidden");

				try {
					const updated = await updateProject(project.id, body);
					return updated;
				} catch {
					return error(500, "Internal Server Error");
				}
			} catch (err) {
				if (err instanceof Error) return error(403, "Forbidden");
			}
		},
		{
			body: t.Object({
				name: t.Optional(t.String()),
				description: t.Optional(t.String()),
			}),
		},
	)
	.delete(
		"/:id",
		async ({ set, error, request, params: { id } }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			try {
				const userRole = await getUserRole(id, session.user.id);
				if (userRole !== "owner") return error(403, "Forbidden");

				try {
					await deleteProject(id);
					set.status = "No Content";
				} catch {
					return error(500, "Internal Server Error");
				}
			} catch (err) {
				if (err instanceof Error) return error(403, "Forbidden");
			}
		},
		{
			detail: {
				responses: {
					203: {
						description: "No content",
					},
					401: {
						description: "Unauthorized",
					},
					403: {
						description: "Forbidden",
					},
					500: {
						description: "Internal Server Error",
					},
				},
			},
		},
	);
