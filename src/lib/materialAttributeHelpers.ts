import { Static, t } from "elysia";
import { db } from "../db";
import { materialAttributes } from "../db/schema";
import { eq } from "drizzle-orm";

export const MaterialAttribute = t.Object({
	characteristicType: t.Optional(t.String()),
});

export type TMaterialAttribute = Static<typeof MaterialAttribute>;

export async function createMaterialAttribute(
	data: TMaterialAttribute,
	investigationId: string,
) {
	const currentTime = new Date();

	return db
		.insert(materialAttributes)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllMaterialAttributes(investigationId: string) {
	return await db.query.materialAttributes.findMany({
		where: eq(materialAttributes.investigation, investigationId),
	});
}

export async function getMaterialAttributeById(materialAttributeId: string) {
	return await db.query.materialAttributes.findFirst({
		where: eq(materialAttributes.id, materialAttributeId),
	});
}

export async function updateMaterialAttributeById(
	data: TMaterialAttribute,
	materialAttributeId: string,
) {
	const currentTime = new Date();
	return db
		.update(materialAttributes)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(materialAttributes.id, materialAttributeId))
		.returning();
}

export async function deleteMaterialAttribute(materialAttributeId: string) {
	await db
		.delete(materialAttributes)
		.where(eq(materialAttributes.id, materialAttributeId));
}
