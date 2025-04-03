import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { projects, projectMember } from "../db/schema";

export async function getUserRole(projectId: string, userId: string) {
	const userRole = await db.query.projectMember.findFirst({
		where: and(
			eq(projectMember.projectId, projectId),
			eq(projectMember.memberId, userId),
		),
		columns: {
			role: true,
		},
	});
	if (!userRole) throw new Error("User not a member");

	return userRole.role;
}

export async function canRead(userId: string, projectId: string) {
	const userRole = await getUserRole(projectId, userId);
	if (!userRole || userRole === "pending") return false;

	return true;
}

export async function canWrite(userId: string, projectId: string) {
	const userRole = await getUserRole(projectId, userId);

	if (!userRole || userRole === "pending" || userRole === "reader")
		return false;

	return true;
}

export async function getAllProjects() {
	return await db.query.projects.findMany();
}

export async function getProjectById(id: string) {
	return await db.query.projects.findFirst({
		where: eq(projects.id, id),
	});
}

export async function createProject(
	userId: string,
	name: string,
	description: string | undefined,
) {
	const currentTime = new Date();

	try {
		await db.transaction(async (trx) => {
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

export async function updateProject(
	projectId: string,
	reqBody: { name?: string; description?: string },
) {
	const updated = await db
		.update(projects)
		.set({
			name: reqBody.name,
			description: reqBody.description,
			updatedAt: new Date(),
		})
		.where(eq(projects.id, projectId))
		.returning();

	return updated;
}

export async function deleteProject(projectId: string) {
	await db.delete(projects).where(eq(projects.id, projectId));
}
