import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	CreateFactor,
	createFactor,
	deleteFactor,
	EditFactor,
	getAllFactors,
	getFactorById,
	updateFactor,
} from "../../lib/factorHelpers";

export const factorHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/factor",
	tags: ["factor"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const results = await getAllFactors(investigationId);
				if (!results) return error(404, "Not Found");

				return results;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:factorId",
		async ({ params: { projectId, factorId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const result = await getFactorById(factorId);
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
				return await createFactor(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: CreateFactor,
		},
	)
	.put(
		"/:factorId",
		async ({ params: { projectId, factorId }, error, request, body, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await updateFactor(body, factorId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: EditFactor,
		},
	)
	.delete(
		"/:factorId",
		async ({ params: { projectId, factorId }, error, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteFactor(factorId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
