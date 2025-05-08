import Elysia from "elysia";
import { auth } from "../utils/auth";
import { canRead, canWrite } from "../lib/projectHelpers";
import {
	createSample,
	deleteSample,
	getAllSample,
	getSampleById,
	Sample,
	updateSample,
} from "../lib/sampleHelpers";

export const sampleHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/samples",
	tags: ["sample"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const results = await getAllSample(investigationId);
				if (!results) return error(404, "Not Found");

				return results;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:sampleId",
		async ({ params: { projectId, sampleId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const result = await getSampleById(sampleId);
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

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				return await createSample(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Sample,
		},
	)
	.put(
		"/:sampleId",
		async ({ params: { projectId, sampleId }, error, request, body, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await updateSample(body, sampleId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Sample,
		},
	)
	.delete(
		"/:sampleId",
		async ({ params: { projectId, sampleId }, error, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteSample(sampleId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
