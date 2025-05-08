import { Static, t } from "elysia";
import { db } from "../db";
import { samples } from "../db/schema";
import { eq } from "drizzle-orm";

export const Sample = t.Object({
	name: t.Optional(t.String()),
	characteristics: t.Optional(t.Array(t.String())),
	factorValues: t.Optional(t.Array(t.String())),
	derivesFrom: t.Optional(t.Array(t.String())),
});

export type TSample = Static<typeof Sample>;

export async function createSample(data: TSample, investigationId: string) {
	const currentTime = new Date();

	return db
		.insert(samples)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllSample(investigationId: string) {
	return db.query.samples.findMany({
		where: eq(samples.investigation, investigationId),
	});
}

export async function getSampleById(sampleId: string) {
	return db.query.samples.findFirst({ where: eq(samples.id, sampleId) });
}

export async function updateSample(data: TSample, sampleId: string) {
	const currentTime = new Date();

	return db
		.update(samples)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(samples.id, sampleId))
		.returning();
}

export async function deleteSample(sampleId: string) {
	db.delete(samples).where(eq(samples.id, sampleId));
}
