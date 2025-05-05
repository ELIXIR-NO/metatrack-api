import Elysia from "elysia";
import { session } from "../../db/schema";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	createProcessParameterValue,
	deleteProcessParameterValue,
	getAllProcessParameterValues,
	getProcessParameterValueById,
	ProcessParameterValue,
	updateProcessParameterValue,
} from "../../lib/processParameterValueHelpers";

export const processParameterValueHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/process/:processId/processParameterValues",
	tags: ["process-parameter-value"],
})
	.get("/", async ({ params: { projectId, processId }, error, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.session) return error(401, "Unauthorized");

		const checkPermissions = await canRead(session.user.id, projectId);
		if (!checkPermissions) return error(403, "Forbidden");

		try {
			const result = await getAllProcessParameterValues(processId);
			if (!result) return error(404, "Not Found");

			return result;
		} catch {
			return error(500, "Internal Server Error");
		}
	})
	.get(
		"/:processParameterValueId",
		async ({
			params: { projectId, processParameterValueId },
			error,
			request,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const result = await getProcessParameterValueById(
					processParameterValueId,
				);
				if (!result) return error(404, "Not Found");

				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({ params: { projectId, processId }, error, body, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const result = await createProcessParameterValue(body, processId);
				if (!result) return error(404, "Not Found");

				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: ProcessParameterValue,
		},
	)
	.put(
		"/:processParameterValueId",
		async ({
			params: { projectId, processParameterValueId },
			error,
			body,
			request,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await updateProcessParameterValue(body, processParameterValueId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: ProcessParameterValue,
		},
	)
	.delete(
		"/:processParameterValueId",
		async ({
			params: { projectId, processParameterValueId },
			error,
			request,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteProcessParameterValue(processParameterValueId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
