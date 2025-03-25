import { eq } from "drizzle-orm";
import { db } from "../db";
import { investigations } from "../db/schema";

export async function getAllInvestigations(projectId: string) {
	return await db.query.investigations.findMany({
		where: eq(investigations.project, projectId),
	});
}

export async function getInvestigationById(investigationId: string) {
	return await db.query.investigations.findFirst({
		where: eq(investigations.id, investigationId),
	});
}
