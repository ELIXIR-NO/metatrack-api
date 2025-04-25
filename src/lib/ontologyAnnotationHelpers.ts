import { Static, t } from "elysia";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { ontologyAnnotations } from "../db/schema";
import { getOntologyById } from "./ontologySourceHelpers";

export const CreateAnnotation = t.Object({
	annotationValue: t.String(),
	termSource: t.String(),
	termAccession: t.Optional(t.String()),
});

export type TCreateAnnotation = Static<typeof CreateAnnotation>;

export const EditAnnotation = t.Object({
	annotationValue: t.Optional(t.String()),
	termSource: t.Optional(t.String()),
	termAccession: t.Optional(t.String()),
});

export type TEditAnnotation = Static<typeof EditAnnotation>;

export async function createAnnotation(data: TCreateAnnotation) {
	const currentTime = new Date();
	return await db
		.insert(ontologyAnnotations)
		.values({ ...data, createdAt: currentTime, updatedAt: currentTime })
		.returning();
}

export async function getAllAnnotations(ontologySourceId: string) {
	return await db.query.ontologyAnnotations.findMany({
		where: eq(ontologyAnnotations.termSource, ontologySourceId),
	});
}

export async function getAnnotationById(
	annotationId: string,
	ontologySourceId: string,
) {
	return await db.query.ontologyAnnotations.findFirst({
		where: and(
			eq(ontologyAnnotations.id, annotationId),
			eq(ontologyAnnotations.termSource, ontologySourceId),
		),
	});
}

export async function updateAnnotations(
	data: TEditAnnotation,
	annotationId: string,
) {
	const currentTime = new Date();
	await db
		.update(ontologyAnnotations)
		.set({ ...data, updatedAt: currentTime })
		.where(eq(ontologyAnnotations.id, annotationId));
}

export async function deleteAnnotation(
	annotationId: string,
	ontologySourceId: string,
) {
	await db
		.delete(ontologyAnnotations)
		.where(
			and(
				eq(ontologyAnnotations.id, annotationId),
				eq(ontologyAnnotations.termSource, ontologySourceId),
			),
		);
}
