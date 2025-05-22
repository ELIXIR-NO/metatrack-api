import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	Assay,
	createAssay,
	deleteAssay,
	editAssay,
	getAllAssays,
	getAssayById,
} from "../../lib/assayHelpers";

export const assayHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/studies/:studyId/assays",
	tags: ["assay"],
})
	.get("/", async ({ params: { projectId, studyId }, error, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.session) return error(401, "Unauthorized");

		const permissions = await canRead(session.user.id, projectId);
		if (!permissions) return error(403, "Forbidden");

		try {
			const assays = await getAllAssays(studyId);
			if (!assays) return error(404, "Not Found");

			return assays;
		} catch {
			return error(500, "Internal Server Error");
		}
	})
	.get(
		"/:assayId",
		async ({ params: { projectId, studyId, assayId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permissions = await canRead(session.user.id, projectId);
			if (!permissions) return error(403, "Forbidden");

			try {
				const assay = await getAssayById(studyId, assayId);
				if (!assay) return error(404, "Not Found");

				return assay;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({ params: { projectId, studyId }, error, set, request, body }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permissions = await canWrite(session.user.id, projectId);
			if (!permissions) return error(403, "Forbidden");

			try {
				await createAssay(body, studyId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Assay,
		},
	)
	.put(
		"/:assayId",
		async ({
			params: { projectId, studyId, assayId },
			error,
			set,
			request,
			body,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permissions = await canWrite(session.user.id, projectId);
			if (!permissions) return error(403, "Forbidden");

			try {
				await editAssay(body, studyId, assayId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Assay,
		},
	)
	.delete(
		"/:assayId",
		async ({ params: { projectId, assayId }, error, set, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permissions = await canWrite(session.user.id, projectId);
			if (!permissions) return error(403, "Forbidden");

			try {
				await deleteAssay(assayId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
