import Elysia from "elysia";
import { auth } from "../utils/auth";
import { canRead, canWrite } from "../lib/projectHelpers";
import {
	createPublication,
	deletePublication,
	getAllPublications,
	getPublicationById,
	Publication,
	updatePublication,
} from "../lib/publicationHelpers";

export const publicationHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/publications",
	tags: ["publication"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const results = await getAllPublications(investigationId);
				if (!results) return error(404, "Not Found");

				return results;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:publicationId",
		async ({ params: { projectId, publicationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const result = await getPublicationById(publicationId);
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
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				return await createPublication(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Publication,
		},
	)
	.put(
		"/:publicationId",
		async ({
			params: { projectId, publicationId },
			error,
			request,
			body,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				await updatePublication(body, publicationId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Publication,
		},
	)
	.delete(
		"/:publicationId",
		async ({ params: { projectId, publicationId }, error, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				await deletePublication(publicationId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
