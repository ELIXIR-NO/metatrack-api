import { Static, t } from "elysia";
import { db } from "../db";
import { processes } from "../db/schema";
import { eq } from "drizzle-orm";

export const Process = t.Object({
	name: t.Optional(t.String()),
	executesProtocol: t.Optional(t.String()),
	parameterValues: t.Optional(t.Array(t.String())),
	performer: t.Optional(t.String()),
	date: t.Optional(t.String()),
	previousProcess: t.Optional(t.String()),
	nextProcess: t.Optional(t.String()),
	inputs: t.Optional(t.Array(t.String())),
	outputs: t.Optional(t.Array(t.String())),
});

export type TProcess = Static<typeof Process>;

export async function createProcess(data: TProcess, investigationId: string) {
	const currentTime = new Date();
	return db
		.insert(processes)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllProcessess(investigationId: string) {
	return db.query.processes.findMany({
		where: eq(processes.investigation, investigationId),
	});
}

export async function getProcessById(processId: string) {
	return db.query.processes.findFirst({ where: eq(processes.id, processId) });
}

export async function updateProcess(data: TProcess, processId: string) {
	const currentTime = new Date();

	return db
		.update(processes)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(processes.id, processId))
		.returning();
}

export async function deleteProcess(processId: string) {
	return db.delete(processes).where(eq(processes.id, processId));
}
