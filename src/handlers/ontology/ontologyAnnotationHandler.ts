import Elysia from "elysia";
import { canRead, canWrite } from "../../lib/projectHelpers";
import { auth } from "../../utils/auth";
import {
	createAnnotation,
	CreateAnnotation,
	deleteAnnoation,
	EditAnnotation,
	getAllAnnotations,
	getAnnotationById,
	updateAnnoations,
} from "../../lib/ontologyAnnotationHelpers";

export const ontologyAnnotationHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/ontology/:ontologySourceId/ontologyAnnotations",
	tags: ["ontology-annotation"],
})
	.get(
		"/",
		async ({
			params: { projectId, investigationId, ontologySourceId },
			request,
			error,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const annotations = await getAllAnnotations(ontologySourceId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:ontologyAnnotationId",
		async ({
			params: {
				projectId,
				investigationId,
				ontologySourceId,
				ontologyAnnotationId,
			},
			request,
			error,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canRead(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const annotation = await getAnnotationById(
					ontologyAnnotationId,
					ontologySourceId,
				);
				if (annotation === undefined) return error(404, "Not Found");
				return annotation;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({
			params: { projectId, investigationId, ontologySourceId },
			request,
			error,
			body,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const result = await createAnnotation(body);
				if (!result) return error(500, "Internal Server Error");

				return result[0];
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: CreateAnnotation,
		},
	)
	.put(
		"/:ontologyAnnotationId",
		async ({
			params: {
				projectId,
				investigationId,
				ontologySourceId,
				ontologyAnnotationId,
			},
			request,
			error,
			body,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				const result = await updateAnnoations(body, ontologyAnnotationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: EditAnnotation,
		},
	)
	.delete(
		"/:ontologyAnnotationId",
		async ({
			params: {
				projectId,
				investigationId,
				ontologySourceId,
				ontologyAnnotationId,
			},
			request,
			error,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermission = await canWrite(session.user.id, projectId);
			if (!checkPermission) return error(403, "Forbidden");

			try {
				await deleteAnnoation(ontologyAnnotationId, ontologySourceId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
