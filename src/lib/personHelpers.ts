import { t, Static } from "elysia";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { people } from "../db/schema";

export const Person = t.Object({
	lastName: t.Optional(t.String()),
	firstName: t.Optional(t.String()),
	midInitial: t.Optional(t.String()),
	email: t.Optional(t.String()),
	fax: t.Optional(t.String()),
	address: t.Optional(t.String()),
	affiliation: t.Optional(t.String()),
	roles: t.Optional(t.Array(t.String())),
});

export type TPerson = Static<typeof Person>;

export async function createPerson(data: TPerson, investigationId: string) {
	const currentTime = new Date();

	return db
		.insert(people)
		.values({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
			investigation: investigationId,
		})
		.returning();
}

export async function getAllPersons(investigationId: string) {
	return db.query.people.findMany({
		where: eq(people.investigation, investigationId),
	});
}

export async function getPersonById(personId: string) {
	return db.query.people.findFirst({ where: eq(people.id, personId) });
}

export async function updatePerson(data: TPerson, personId: string) {
	const currentTime = new Date();

	return db
		.update(people)
		.set({
			...data,
			updatedAt: currentTime,
		})
		.where(eq(people.id, personId));
}

export async function deletePerson(personId: string) {
	return db.delete(people).where(eq(people.id, personId));
}
