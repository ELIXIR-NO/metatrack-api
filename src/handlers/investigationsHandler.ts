import Elysia, { t } from "elysia";

import { auth } from "../utils/auth";
import { getUserMembership } from "../lib/sharedHelpers";
import { getUserRole } from "../lib/projectHelpers";
import {
	getAllInvestigations,
	getInvestigationById,
} from "../lib/investigationHelpers";

export const invetigationsHandler = new Elysia({
	prefix: "/projects/:projectId/investigations",
	tags: ["investigations"],
})
	.get(
		"/",
		async ({ params: { projectId }, request, error }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const userRole = await getUserMembership(session.user.id, projectId);
			if (!userRole || userRole === "pending") return error(403, "Forbidden");

			const investigations = await getAllInvestigations(projectId);

			return investigations;
		},
		{
			detail: {
				responses: {
					401: {
						description: "Unauthenticated. Likely due to not being signed in.",
					},
					403: {
						description:
							"The current logged in user doesn't have access to the requested resource",
					},
					200: {
						description: "Success",
					},
				},
			},
		},
	)
	.get(
		"/:investigationId",
		async ({ params: { projectId, investigationId }, request, error }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const userRole = await getUserRole(projectId, session.user.id);
			if (!userRole || userRole === "pending") return error(403, "Forbidden");

			const investigation = await getInvestigationById(investigationId);
			return investigation;
		},
		{
			detail: {
				responses: {
					401: {
						description: "Unauthenticated. Likely due to not being signed in.",
					},
					403: {
						description:
							"The current logged in user doesn't have access to the requested resource",
					},
				},
			},
		},
	)
	.post("/", async () => {})
	.put("/:investigationId", async () => {})
	.delete("/:investigationId", async () => {});
