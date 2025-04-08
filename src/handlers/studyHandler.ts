import Elysia from "elysia";
import { auth } from "../utils/auth";
import { getUserRole } from "../lib/projectHelpers";
import {
	CreateStudy,
	createStudy,
	EditStudy,
	getAllStudies,
	getStudyById,
	updateStudy,
} from "../lib/studyHelpers";

export const studyHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/studies",
	tags: ["study"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const userRole = await getUserRole(projectId, session.user.id);
			if (!userRole || userRole === "pending") return error(403, "Forbidden");

			try {
				const studies = await getAllStudies(investigationId);
				if (!studies) return error(404, "Not Found");

				return studies;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:studyId",
		async ({
			params: { projectId, investigationId, studyId },
			error,
			request,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const userRole = await getUserRole(projectId, session.user.id);
			if (!userRole || userRole === "pending") return error(403, "Forbidden");

			try {
				const study = await getStudyById(studyId);
				if (!study) return error(404, "Not Found");

				return study;
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
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const userRole = await getUserRole(projectId, session.user.id);
			if (!userRole || userRole === "pending" || userRole === "reader")
				return error(403, "Forbidden");

			try {
				await createStudy(body, investigationId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: CreateStudy,
		},
	)
	.put(
		"/:studyId",
		async ({
			params: { projectId, investigationId, studyId },
			error,
			request,
			body,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const userRole = await getUserRole(projectId, session.user.id);
			if (!userRole || userRole === "pending" || userRole === "reader")
				return error(403, "Forbidden");

			try {
				await updateStudy(body, investigationId, studyId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: EditStudy,
		},
	)
	.delete("/:studyId", async () => {});
