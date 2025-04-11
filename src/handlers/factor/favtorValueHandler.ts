import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead } from "../../lib/projectHelpers";
import {
	getAllFactorValues,
	getFactorValueById,
	createFactorValue,
	FactorValue,
	editFactorValue,
	deleteFactorValue,
} from "../../lib/factorValueHelpers";

export const factorValueHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/factor/:factorId/factor-value",
	tags: ["factor-value"],
})
	.get("/", async ({ params: { projectId, factorId }, error, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.session) return error(401, "Unauthorized");

		const permissions = await canRead(session.user.id, projectId);
		if (!permissions) return error(403, "Forbidden");

		try {
			const factorValues = await getAllFactorValues(factorId);
			if (!factorValues) return error(404, "Not Found");

			return factorValues;
		} catch {
			return error(500, "Internal Server Error");
		}
	})
	.get(
		"/:factorValueId",
		async ({
			params: { projectId, factorId, factorValueId },
			error,
			request,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permissions = await canRead(session.user.id, projectId);
			if (!permissions) return error(403, "Forbidden");

			try {
				const factorValue = await getFactorValueById(factorId, factorValueId);
				if (!factorValue) return error(404, "Not Found");

				return factorValue;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({ params: { projectId, factorId }, error, set, request, body }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permissions = await canRead(session.user.id, projectId);
			if (!permissions) return error(403, "Forbidden");

			try {
				await createFactorValue(body, factorId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: FactorValue,
		},
	)
	.put(
		"/:factorValueId",
		async ({
			params: { projectId, factorValueId },
			set,
			error,
			request,
			body,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permissions = await canRead(session.user.id, projectId);
			if (!permissions) return error(403, "Forbidden");

			try {
				await editFactorValue(body, factorValueId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: FactorValue,
		},
	)
	.delete(
		"/:factorValueId",
		async ({ params: { projectId, factorValueId }, set, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permissions = await canRead(session.user.id, projectId);
			if (!permissions) return error(403, "Forbidden");

			try {
				await deleteFactorValue(factorValueId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
