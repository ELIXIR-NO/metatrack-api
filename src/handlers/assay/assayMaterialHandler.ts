import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	createAssayMaterials,
	getAllAssayMaterials,
	getAssayMaterialsById,
	AssayMaterials,
	updateAssayMaterials,
	deleteAssayMaterials,
} from "../../lib/assayMaterialHelpers";

export const assayMaterialHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/studies/:studyId/assays/:assayId/assayMaterials",
	tags: ["assay-material"],
})
	.get("/", async ({ params: { projectId, assayId }, error, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.session) return error(401, "Unauthorized");

		const checkPermission = await canRead(session.user.id, projectId);
		if (!checkPermission) return error(403, "Forbidden");

		try {
			const results = await getAllAssayMaterials(assayId);
			if (!results) return error(404, "Not Found");

			return results;
		} catch {
			return error(500, "Internal Server Error");
		}
	})
	.get(
		"/:assayMaterialId",
		async ({ params: { projectId, assayMaterialId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const result = await getAssayMaterialsById(assayMaterialId);
				if (!result) return error(404, "Not Found");

				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/:assayMaterialId",
		async ({ params: { projectId, assayId }, error, request, body }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				return await createAssayMaterials(body, assayId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: AssayMaterials,
		},
	)
	.put(
		"/:assayMaterialId",
		async ({
			params: { projectId, assayMaterialId },
			error,
			set,
			request,
			body,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				await updateAssayMaterials(body, assayMaterialId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: AssayMaterials,
		},
	)
	.delete(
		"/:assayMaterialId",
		async ({ params: { projectId, assayMaterialId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				await deleteAssayMaterials(assayMaterialId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
