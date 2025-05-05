import Elysia from "elysia";
import { auth } from "../utils/auth";
import { canRead, canWrite } from "../lib/projectHelpers";
import {
	createPerson,
	deletePerson,
	getAllPersons,
	getPersonById,
	Person,
	updatePerson,
} from "../lib/personHelpers";

export const personHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/people",
	tags: ["person"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, request, error }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const results = await getAllPersons(investigationId);
				if (!results) return error(404, "Not Found");

				return results;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:personId",
		async ({
			params: { projectId, investigationId, personId },
			error,
			request,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canRead(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				const person = await getPersonById(personId);
				if (!person) return error(404, "Not Found");

				return person;
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
				return await createPerson(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Person,
		},
	)
	.put(
		"/:personId",
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
				return await updatePerson(body, investigationId);
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: Person,
		},
	)
	.delete(
		"/:personId",
		async ({ params: { projectId, personId }, error, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const checkPermissions = await canWrite(session.user.id, projectId);
			if (!checkPermissions) return error(403, "Forbidden");

			try {
				await deletePerson(personId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
