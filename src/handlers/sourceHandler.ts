import Elysia from "elysia";
import { auth } from "../utils/auth";
import { canRead, canWrite } from "../lib/projectHelpers";
import {
	createSource,
	deleteSource,
	getAllSources,
	getSourceById,
	Source,
	updateSource,
} from "../lib/sourceHelpers";

export const sourceHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/sources",
	tags: ["sources"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const results = await getAllSources(investigationId);
				if (!results) return error(404, "Not Found");

				return results;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:sourceId",
		async ({ params: { projectId, sourceId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const result = await getSourceById(sourceId);
				if (!result) return error(404, "Not Found");

				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({
			params: { projectId, investigationId },
			error,
			request,
			body,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				return await createSource(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Source,
		},
	)
	.put(
		"/:sourceId",
		async ({ params: { projectId, sourceId }, error, request, body, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await updateSource(body, sourceId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Source,
		},
	)
	.delete(
		"/:sourceId",
		async ({ params: { projectId, sourceId }, error, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteSource(sourceId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
