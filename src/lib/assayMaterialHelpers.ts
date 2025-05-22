import { Static, t } from "elysia";
import { db } from "../db";
import { assayMaterials } from "../db/schema";
import { eq } from "drizzle-orm";

export const AssayMaterials = t.Object({
	samples: t.Optional(t.Array(t.String())),
	otherMaterials: t.Optional(t.Array(t.String())),
});

export type TAssayMaterials = Static<typeof AssayMaterials>;

export async function createAssayMaterials(
	data: TAssayMaterials,
	assayId: string,
) {
	const currentTime = new Date();

	return db
		.insert(assayMaterials)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			assay: assayId,
		})
		.returning();
}

export async function getAllAssayMaterials(assayId: string) {
	return db.query.assayMaterials.findMany({
		where: eq(assayMaterials.assay, assayId),
	});
}

export async function getAssayMaterialsById(assayMaterialId: string) {
	return db.query.assayMaterials.findFirst({
		where: eq(assayMaterials.id, assayMaterialId),
	});
}

export async function updateAssayMaterials(
	data: TAssayMaterials,
	assayMaterialId: string,
) {
	const currentTime = new Date();

	db.update(assayMaterials)
		.set({ ...data, updatedAt: currentTime })
		.where(eq(assayMaterials.id, assayMaterialId));
}

export async function deleteAssayMaterials(assayMaterialId: string) {
	db.delete(assayMaterials).where(eq(assayMaterials.id, assayMaterialId));
}
