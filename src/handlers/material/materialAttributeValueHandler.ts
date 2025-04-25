import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	createMaterialAttributeValue,
	deleteMaterialAttributeValue,
	getAllMaterialAttributeValues,
	getMaterialAttributeValueById,
	MaterialAttributeValue,
	updateMaterialAttributeValue,
} from "../../lib/materialAttributeValueHelpers";

export const materialAttributeValueHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/materialAttributeValues",
	tags: ["material-attribute-values"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const results = await getAllMaterialAttributeValues(investigationId);
				if (!results) return error(404, "Not Found");

				return results;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:materialAttributeValueId",
		async ({
			params: { projectId, materialAttributeValueId },
			error,
			request,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const result = await getMaterialAttributeValueById(
					materialAttributeValueId,
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
				const result = await createMaterialAttributeValue(
					body,
					investigationId,
				);
				if (!result) return error(404, "Not Found");

				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: MaterialAttributeValue,
		},
	)
	.put(
		"/:materialAttributeValueId",
		async ({
			params: { projectId, investigationId, materialAttributeValueId },
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
				await updateMaterialAttributeValue(body, materialAttributeValueId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: MaterialAttributeValue,
		},
	)
	.delete(
		"/:materialAttributeValueId",
		async ({
			params: { projectId, investigationId, materialAttributeValueId },
			error,
			request,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				await deleteMaterialAttributeValue(materialAttributeValueId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
