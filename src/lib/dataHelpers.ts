import { Static, t } from "elysia";
import { db } from "../db";
import { data } from "../db/schema";
import { and, eq } from "drizzle-orm";

enum DataFileType {
	"Raw Data File",
	"Derived Data File",
	"Image File",
}

export const CreateData = t.Object({
	name: t.String(),
	type: t.Enum(DataFileType),
});
export type TCreateData = Static<typeof CreateData>;

export const EditData = t.Object({
	name: t.Optional(t.String()),
	type: t.Optional(t.Enum(DataFileType)),
});
export type TEditData = Static<typeof EditData>;

export async function createData(
	inputData: TCreateData,
	investigationId: string,
) {
	const currentTime = new Date();

	return await db.insert(data).values({
		...inputData,
		createdAt: currentTime,
		updatedAt: currentTime,
		investigation: investigationId,
	});
}

export async function getAllData(investigationId: string) {
	return await db.query.data.findMany({
		where: eq(data.investigation, investigationId),
	});
}

export async function getDataById(investigationId: string, dataId: string) {
	return await db.query.data.findFirst({
		where: and(eq(data.investigation, investigationId), eq(data.id, dataId)),
	});
}

export async function editData(
	inputData: TEditData,
	investigationId: string,
	dataId: string,
) {
	const currentTime = new Date();

	return await db
		.update(data)
		.set({
			...inputData,
			updatedAt: currentTime,
		})
		.where(and(eq(data.investigation, investigationId), eq(data.id, dataId)));
}

export async function deleteData(dataId: string) {
	await db.delete(data).where(eq(data.id, dataId));
}
