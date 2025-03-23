import { Elysia, t } from "elysia";
import { db } from "../db";
import { projectMember, projects } from "../db/schema/project-schema";
import { eq } from "drizzle-orm";
import { auth } from "../utils/auth";

export const projectsHandler = new Elysia({ prefix: "/projects" })
	.get("/", async (ctx) => await db.select().from(projects))
	.get(
		"/:id",
		async ({ error, params: { id } }) => {
			const result = await getProjectById(id);
			if (!result.length) return error(404, "Not Found");

			return result[0];
		},
		{
			detail: {
				responses: {
					200: {
						description: "Project found",
					},
					404: {
						description: "Project not found",
					},
				},
			},
		},
	)
	.post(
		"/",
		async ({ set, request, body: { name, description }, error }) => {
			if (!name) return error(400, "Bad Request");

			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.user) return error(401, "Unauthorized");

			const userId = session.user.id;
			try {
				await createProject(userId, name, description);
			} catch (err) {
				if (err instanceof Error) return error(500, err.message);
			}

			set.status = "Created";
		},
		{
			detail: {
				responses: {
					201: {
						description: "Project created",
					},
					400: {
						description: "Bad request",
					},
					401: {
						description: "Unauthorized",
					},
				},
			},
			body: t.Object({
				name: t.String(),
				description: t.Optional(t.String()),
			}),
		},
	);

async function getProjectById(id: string) {
	return await db.select().from(projects).where(eq(projects.id, id));
}

async function createProject(
	userId: string,
	name: string,
	description: string | undefined,
) {
	const currentTime = new Date();

	try {
		const trans = await db.transaction(async (trx) => {
			const createdProj = await trx
				.insert(projects)
				.values({
					name,
					description,
					createdAt: currentTime,
					updatedAt: currentTime,
				})
				.returning();

			await trx.insert(projectMember).values({
				memberId: userId,
				projectId: createdProj[0].id,
				role: "owner",
			});
		});
	} catch {
		throw new Error("Could not create project");
	}
}
