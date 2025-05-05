import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	createProtocolParameter,
	deleteProtocolParameter,
	getAllProtocolParmaters,
	getProtocolParameterById,
	ProtocolParameter,
	updateProtocolParameter,
} from "../../lib/protocolParameterHelpers";

export const protocolParameterHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/protocols/:protocolId/protocolParameters",
	tags: ["protocol-parameter"],
})
	.get("/", async ({ params: { projectId, protocolId }, error, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.session) return error(401, "Unauthorized");

		const checkPermissions = await canRead(session.user.id, projectId);
		if (!checkPermissions) return error(403, "Forbidden");

		try {
			const results = await getAllProtocolParmaters(protocolId);
			if (!results) return error(404, "Not Found");

			return results;
		} catch {
			return error(500, "Internal Server Error");
		}
	})
	.get(
		"/:protocolParameterId",
		async ({ params: { projectId, protocolParameterId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const result = await getProtocolParameterById(protocolParameterId);
				if (!result) return error(404, "Not Found");

				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({ params: { projectId, protocolId }, error, body, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				return await createProtocolParameter(body, protocolId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: ProtocolParameter,
		},
	)
	.put(
		"/:protocolParameterId",
		async ({
			params: { projectId, protocolParameterId },
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
				await updateProtocolParameter(body, protocolParameterId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: ProtocolParameter,
		},
	)
	.delete(
		"/:protocolParameterId",
		async ({
			params: { projectId, protocolParameterId },
			error,
			request,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteProtocolParameter(protocolParameterId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
