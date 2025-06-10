import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { studies } from "../db/schema";
import { Static, t } from "elysia";

export const CreateStudy = t.Object({
	filename: t.Optional(t.String()),
	identifier: t.String(),
	title: t.Optional(t.String()),
	description: t.Optional(t.String()),
	submissionDate: t.Optional(t.String()),
	publicReleaseDate: t.Optional(t.String()),
	publications: t.Optional(t.Array(t.String())),
	people: t.Optional(t.Array(t.String())),
	studyDesignDescriptors: t.Optional(t.Array(t.String())),
	protocols: t.Optional(t.Array(t.String())),
	materials: t.Optional(t.String()),
	processSequence: t.Optional(t.Array(t.String())),
	assays: t.Optional(t.Array(t.String())),
	factors: t.Optional(t.Array(t.String())),
	characteristicCategories: t.Optional(t.Array(t.String())),
	unitCategories: t.Optional(t.Array(t.String())),
});
export type TCreateStudy = Static<typeof CreateStudy>;

export const EditStudy = t.Omit(CreateStudy, ["identifier"]);
export type TEditStudy = Static<typeof EditStudy>;

function cleanStudyDateData(data: TCreateStudy) {
	return {
		...data,
		submissionDate: data.submissionDate === "" ? null : data.submissionDate,
		publicReleaseDate:
			data.publicReleaseDate === "" ? null : data.publicReleaseDate,
	};
}

export async function createStudy(data: TCreateStudy, investigationId: string) {
	const currentTime = new Date();
	const cleanStudyData = cleanStudyDateData(data);

	return await db
		.insert(studies)
		.values({
			...cleanStudyData,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllStudies(investigationId: string) {
	return await db.query.studies.findMany({
		where: eq(studies.investigation, investigationId),
	});
}

export async function getStudyById(studyId: string) {
	return await db.query.studies.findFirst({
		where: eq(studies.id, studyId),
	});
}

export async function updateStudy(
	data: TEditStudy,
	investigationId: string,
	studyId: string,
) {
	const currentTime = new Date();

	await db
		.update(studies)
		.set({ ...data, updatedAt: currentTime })
		.where(
			and(eq(studies.id, studyId), eq(studies.investigation, investigationId)),
		);
}

export async function deleteStudy(studyId: string) {
	await db.delete(studies).where(eq(studies.id, studyId));
}
