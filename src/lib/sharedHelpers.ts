import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { projectMember } from "../db/schema";

export async function getUserMembership(userId: string, projectId: string) {
	const result = await db.query.projectMember.findFirst({
		where: and(
			eq(projectMember.memberId, userId),
			eq(projectMember.projectId, projectId),
		),
		columns: {
			role: true,
		},
	});
	return result?.role;
}
