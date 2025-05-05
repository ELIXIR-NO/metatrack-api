import { Static, t } from "elysia";
import { db } from "../db";
import { investigations, materials } from "../db/schema";
import { eq } from "drizzle-orm";

enum MaterialTypeEnum {
	ExtractName = "Extract Name",
	LabeledExtractName = "Labeled Extract Name",
}

export const Material = t.Object({
	name: t.Optional(t.String()),
	type: t.Optional(
		t.Union([
			t.Literal(MaterialTypeEnum.ExtractName),
			t.Literal(MaterialTypeEnum.LabeledExtractName),
		]),
	),
	characteristics: t.Optional(t.Array(t.String())),
	derivesFrom: t.Optional(t.Array(t.String())),
});

export type TMaterial = Static<typeof Material>;

// TODO: Deal with the self referencing in the derivedFrom attribute

export async function createMaterial(data: TMaterial, investigationId: string) {
	const currentTime = new Date();

	return db
		.insert(materials)
		.values({
			name: data.name,
			type: data.type,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllMaterials(investigationId: string) {
	return db.query.materials.findMany({
		where: eq(investigations.id, investigationId),
	});
}

export async function getMaterialById(materialId: string) {
	return db.query.materials.findFirst({ where: eq(materials.id, materialId) });
}

export async function updateMaterial(data: TMaterial, materialId: string) {
	const currentTime = new Date();

	return db
		.update(materials)
		.set({
			name: data.name,
			type: data.type,
			updatedAt: currentTime,
		})
		.where(eq(materials.id, materialId))
		.returning();
}

export async function deleteMaterial(materialId: string) {
	db.delete(materials).where(eq(materials.id, materialId));
}
