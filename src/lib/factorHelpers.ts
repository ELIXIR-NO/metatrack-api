import { Static, t } from "elysia";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { factors } from "../db/schema";

export const CreateFactor = t.Object({
	factorName: t.String(),
	factorType: t.Optional(t.String()),
});

export type TCreateFactor = Static<typeof CreateFactor>;

export const EditFactor = t.Object({
	factorName: t.Optional(t.String()),
	factorType: t.Optional(t.String()),
});

export type TEditFactor = Static<typeof EditFactor>;

export async function createFactor(
	data: TCreateFactor,
	investigationId: string,
) {
	const currentTime = new Date();

	return await db
		.insert(factors)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllFactors(investigationId: string) {
	return await db.query.factors.findMany({
		where: eq(factors.investigation, investigationId),
	});
}

export async function getFactorById(investigationId: string, factorId: string) {
	return await db.query.factors.findFirst({
		where: and(
			eq(factors.investigation, investigationId),
			eq(factors.id, factorId),
		),
	});
}

export async function updateFactor(data: TEditFactor, factorId: string) {
	const currentTime = new Date();

	return await db
		.update(factors)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(factors.id, factorId))
		.returning();
}

export async function deleteFactor(factorId: string) {
	await db.delete(factors).where(eq(factors.id, factorId));
}
