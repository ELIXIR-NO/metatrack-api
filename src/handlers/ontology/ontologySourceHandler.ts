import Elysia from "elysia";
import { auth } from "../../utils/auth";
import { canRead, canWrite } from "../../lib/projectHelpers";
import {
	EditOntologySourceReference,
	OntologySourceReference,
	createOntology,
	deleteOntolgy,
	getAllOntologies,
	getOntologyById,
	updateOntology,
} from "../../lib/ontologySourceHelpers";

export const ontologySourceHandler = new Elysia({
	prefix:
		"/projects/:projectId/investigations/:investigationId/ontologySources",
	tags: ["ontology-sources"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, request, error }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.session.userId, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			return await getAllOntologies(investigationId);
		},
	)
	.get(
		"/:ontologySourceId",
		async ({
			params: { projectId, investigationId, ontologySourceId },
			request,
			error,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.session.userId, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			const ontologySource = await getOntologyById(
				investigationId,
				ontologySourceId,
			);
			if (!ontologySource) return error(404, "Not Found");

			return ontologySource;
		},
	)
	.post(
		"/",
		async ({
			params: { projectId, investigationId },
			request,
			body,
			error,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(
				session.session.userId,
				projectId,
			);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await createOntology(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: OntologySourceReference,
		},
	)
	.put(
		"/:ontologySourceId",
		async ({
			params: { projectId, investigationId, ontologySourceId },
			request,
			body,
			error,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(
				session.session.userId,
				projectId,
			);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await updateOntology(body, investigationId, ontologySourceId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: EditOntologySourceReference,
		},
	)
	.delete(
		"/:ontologySourceId",
		async ({
			params: { projectId, investigationId, ontologySourceId },
			request,
			error,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(
				session.session.userId,
				projectId,
			);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deleteOntolgy(investigationId, ontologySourceId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
