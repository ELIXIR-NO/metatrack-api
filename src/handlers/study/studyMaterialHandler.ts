import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	createStudyMaterials,
	deleteStudyMaterials,
	getStudyMaterialById,
	StudyMaterials,
	updateStudyMaterials,
} from "../../lib/studyMaterialHelpers";

export const studyMaterialHandler = new Elysia({
	prefix: "projects/:projectId/investigations/:investigationId/studis/:studyId",
	tags: ["study-material"],
})
	.get(
		"/",
		async ({ params: { projectId, studyId }, error, body, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const results = await createStudyMaterials(body, studyId);
				if (!results) return error(404, "Not Found");

				return results;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: StudyMaterials,
		},
	)
	.get(
		"/:studyMaterialId",
		async ({ params: { projectId, studyMaterialId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const result = await getStudyMaterialById(studyMaterialId);
				if (!result) return error(404, "Not Found");

				return result;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({ params: { projectId, studyId }, error, body, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");
			try {
				return await createStudyMaterials(body, studyId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: StudyMaterials,
		},
	)
	.put(
		"/:studyMaterialId",
		async ({
			params: { projectId, studyMaterialId },
			error,
			body,
			set,
			request,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await updateStudyMaterials(body, studyMaterialId);
				set.status = 204;
			} catch {
				return error(500, "Internatl Server Error");
			}
		},
		{
			body: StudyMaterials,
		},
	)
	.delete(
		"/:studyMaterialId",
		async ({ params: { projectId, studyMaterialId }, error, set, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteStudyMaterials(studyMaterialId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
