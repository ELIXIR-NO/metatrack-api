import { Static, t } from "elysia";
import { db } from "../db";
import { studyMaterials } from "../db/schema";
import { eq } from "drizzle-orm";

export const StudyMaterials = t.Object({
	sources: t.Optional(t.Array(t.String())),
	samples: t.Optional(t.Array(t.String())),
	otherMaterials: t.Optional(t.Array(t.String())),
});

export type TStudyMaterials = Static<typeof StudyMaterials>;

export async function createStudyMaterials(
	data: TStudyMaterials,
	studyId: string,
) {
	const currentTime = new Date();

	return db
		.insert(studyMaterials)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			study: studyId,
		})
		.returning();
}

export async function getAllStudyMaterials(studyId: string) {
	return db.query.studyMaterials.findMany({
		where: eq(studyMaterials.study, studyId),
	});
}

export async function getStudyMaterialById(studyMaterialId: string) {
	return db.query.studyMaterials.findFirst({
		where: eq(studyMaterials.id, studyMaterialId),
	});
}

export async function updateStudyMaterials(
	data: TStudyMaterials,
	studyMaterialId: string,
) {
	const currentTime = new Date();

	db.update(studyMaterials)
		.set({ ...data, updatedAt: currentTime })
		.where(eq(studyMaterials.id, studyMaterialId));
}

export async function deleteStudyMaterials(studyMaterialId: string) {
	db.delete(studyMaterials).where(eq(studyMaterials.id, studyMaterialId));
}
