import { Static, t } from "elysia";
import { db } from "../db";
import { publications } from "../db/schema";
import { eq } from "drizzle-orm";

export const Publication = t.Object({
	pubMedId: t.Optional(t.String()),
	doi: t.Optional(t.String()),
	authorList: t.Optional(t.String()),
	title: t.Optional(t.String()),
	status: t.Optional(t.String()),
});

export type TPublication = Static<typeof Publication>;

export async function createPublication(
	data: TPublication,
	investigationId: string,
) {
	const currentTime = new Date();

	return db
		.insert(publications)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllPublications(investigationId: string) {
	return db.query.publications.findMany({
		where: eq(publications.investigation, investigationId),
	});
}

export async function getPublicationById(publicationId: string) {
	return db.query.publications.findFirst({
		where: eq(publications.id, publicationId),
	});
}

export async function updatePublication(
	data: TPublication,
	publicationId: string,
) {
	const currentTime = new Date();

	return db
		.update(publications)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(publications.id, publicationId))
		.returning();
}

export async function deletePublication(publicationId: string) {
	db.delete(publications).where(eq(publications.id, publicationId));
}
