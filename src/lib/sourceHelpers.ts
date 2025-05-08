import { Static, t } from "elysia";
import { db } from "../db";
import { sources } from "../db/schema";
import { eq } from "drizzle-orm";

export const Source = t.Object({
	name: t.Optional(t.String()),
	characteristics: t.Optional(t.Array(t.String())),
});

export type TSource = Static<typeof Source>;

export async function createSource(data: TSource, investigationId: string) {
	const currentTime = new Date();

	return db.insert(sources).values({
		...data,
		createdAt: currentTime,
		updatedAt: currentTime,
		investigation: investigationId,
	});
}

export async function getAllSources(investigationId: string) {
	return db.query.sources.findMany({
		where: eq(sources.investigation, investigationId),
	});
}

export async function getSourceById(sourceId: string) {
	return db.query.sources.findFirst({ where: eq(sources.id, sourceId) });
}

export async function updateSource(data: TSource, sourceId: string) {
	const currentTime = new Date();

	return db
		.update(sources)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(sources.id, sourceId))
		.returning();
}

export async function deleteSource(sourceId: string) {
	db.delete(sources).where(eq(sources.id, sourceId));
}
