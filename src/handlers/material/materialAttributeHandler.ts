import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	createMaterialAttribute,
	deleteMaterialAttribute,
	getAllMaterialAttributes,
	getMaterialAttributeById,
	MaterialAttribute,
	updateMaterialAttributeById,
} from "../../lib/materialAttributeHelpers";

export const materialAttributeHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/materialAttributes",
	tags: ["material-attributes"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, request, error }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const materialAttributes =
					await getAllMaterialAttributes(investigationId);
				if (!materialAttributes) return error(404, "Not Found");
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:materialAttributeId",
		async ({ params: { projectId, materialAttributeId }, request, error }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const materialAttribute =
					await getMaterialAttributeById(materialAttributeId);
				if (!materialAttribute) return error(404, "Not Found");

				return materialAttribute;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({
			params: { projectId, investigationId },
			body,
			request,
			error,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				return await createMaterialAttribute(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: MaterialAttribute,
		},
	)
	.put(
		"/:materialAttributeId",
		async ({
			params: { projectId, investigationId },
			request,
			error,
			body,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const result = await updateMaterialAttributeById(body, investigationId);
				if (!result) return error(404, "Not Found");

				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: MaterialAttribute,
		},
	)
	.delete(
		"/:materialAttributeId",
		async ({
			params: { projectId, materialAttributeId },
			request,
			error,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				await deleteMaterialAttribute(materialAttributeId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
