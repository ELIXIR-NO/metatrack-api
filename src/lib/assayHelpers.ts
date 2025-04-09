import { Static, t } from "elysia";
import { db } from "../db";
import { assays } from "../db/schema";
import { and, eq } from "drizzle-orm";

// TODO: Deal with the assay_materials table as well!

export const Assay = t.Object({
	filename: t.Optional(t.String()),
	measurementType: t.Optional(t.String()),
	technologyType: t.Optional(t.String()),
	technologyPlatform: t.Optional(t.String()),
	dataFiles: t.Optional(t.Array(t.String())),
	materials: t.Optional(t.String()),
	characteristicCategories: t.Optional(t.Array(t.String())),
	unitCategories: t.Optional(t.Array(t.String())),
	processSequence: t.Optional(t.Array(t.String())),
});

export type TAssay = Static<typeof Assay>;

export async function createAssay(data: TAssay, studyId: string) {
	const currentTime = new Date();

	return await db
		.insert(assays)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			study: studyId,
		})
		.returning();
}

export async function getAllAssays(studyId: string) {
	return await db.query.assays.findMany({
		where: eq(assays.study, studyId),
	});
}

export async function getAssayById(studyId: string, assayId: string) {
	return await db.query.assays.findFirst({
		where: and(eq(assays.study, studyId), eq(assays.id, assayId)),
	});
}

export async function editAssay(
	data: TAssay,
	studyId: string,
	assayId: string,
) {
	const currentTime = new Date();

	return await db
		.update(assays)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(and(eq(assays.study, studyId), eq(assays.id, assayId)))
		.returning();
}

export async function deleteAssay(assayId: string) {
	await db.delete(assays).where(eq(assays.id, assayId));
}
