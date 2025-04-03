import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { investigations } from "../db/schema";
import { Static, t } from "elysia";

export const Investigation = t.Object({
	filename: t.Optional(t.String()),
	identifier: t.String(),
	title: t.Optional(t.String()),
	submissionDate: t.Optional(t.String()),
	publicReleaseDate: t.Optional(t.String()),
	ontologySourceReferences: t.Optional(t.String(t.String())),
	publications: t.Optional(t.Array(t.String())),
	people: t.Optional(t.Array(t.String())),
	studies: t.Optional(t.Array(t.String())),
});

export type TInvestigation = Static<typeof Investigation>;

export const EditInvestigaiton = t.Omit(Investigation, ["identifier"]);
export type TEditInvestigation = Static<typeof EditInvestigaiton>;

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

export async function saveInvestigation(
	data: TInvestigation,
	projectId: string,
) {
	const currentTime = new Date();
	return await db
		.insert(investigations)
		.values({ ...data, createdAt: currentTime, updatedAt: currentTime })
		.returning();
}

export async function updateInvestigation(
	data: TEditInvestigation,
	projectId: string,
	investigationId: string,
) {
	const investigation = getInvestigationById(investigationId);
	if (investigation === undefined) return undefined;

	const currentTime = new Date();
	return await db
		.update(investigations)
		.set({ ...data, updatedAt: currentTime })
		.where(
			and(
				eq(investigations.project, projectId),
				eq(investigations.id, investigationId),
			),
		);
}

export async function deleteInvestigation(
	projectId: string,
	investigationId: string,
) {
	const investigation = await db.query.investigations.findFirst({
		where: and(
			eq(investigations.project, projectId),
			eq(investigations.id, investigationId),
		),
	});
	if (investigation === undefined) return undefined;

	return await db
		.delete(investigations)
		.where(
			and(
				eq(investigations.project, projectId),
				eq(investigations.id, investigationId),
			),
		);
}
