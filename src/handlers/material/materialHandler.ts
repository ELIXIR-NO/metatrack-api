import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	createMaterial,
	deleteMaterial,
	getAllMaterials,
	getMaterialById,
	Material,
	updateMaterial,
} from "../../lib/materialHelpers";

export const materialHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/materials",
	tags: ["materials"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const materials = await getAllMaterials(investigationId);
				if (!materials) return error(404, "Not Found");
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:materialId",

		async ({ params: { projectId, materialId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const material = await getMaterialById(materialId);
				if (!material) return error(404, "Not Found");
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
				const result = await createMaterial(body, investigationId);
				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Material,
		},
	)
	.put(
		"/:materialId",
		async ({
			params: { projectId, materialId },
			error,
			request,
			body,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await updateMaterial(body, materialId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Material,
		},
	)
	.delete(
		"/:materialId",
		async ({
			params: { projectId, materialId },
			error,
			request,
			body,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteMaterial(materialId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
