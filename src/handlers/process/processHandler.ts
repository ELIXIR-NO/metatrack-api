import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	createProcess,
	deleteProcess,
	getAllProcessess,
	getProcessById,
	Process,
	updateProcess,
} from "../../lib/processHelpers";

export const processHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/processs",
	tags: ["process"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const results = await getAllProcessess(investigationId);
				if (!results) return error(404, "Not Found");

				return results;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:processId",
		async ({ params: { projectId, processId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const result = await getProcessById(processId);
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
			body,
			request,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				return await createProcess(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Process,
		},
	)
	.put(
		"/:processId",
		async ({ params: { projectId, processId }, error, set, body, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await updateProcess(body, processId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Process,
		},
	)
	.delete(
		"/:processId",
		async ({ params: { projectId, processId }, error, set, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteProcess(processId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
