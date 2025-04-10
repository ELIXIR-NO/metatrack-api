import Elysia from "elysia";
import { auth } from "../utils/auth";
import { canRead, canWrite } from "../lib/projectHelpers";
import {
	CreateData,
	createData,
	deleteData,
	EditData,
	editData,
	getAllData,
	getDataById,
} from "../lib/dataHelpers";

export const dataHandler = new Elysia({
	prefix: "/projects/:projectId/investigations/:investigationId/data",
	tags: ["data"],
})
	.get(
		"/",
		async ({ params: { projectId, investigationId }, error, request }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permission = await canRead(session.user.id, projectId);
			if (!permission) return error(403, "Forbidden");

			try {
				const data = await getAllData(investigationId);
				if (!data) return error(404, "Not Found");

				return data;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.get(
		"/:dataId",
		async ({
			params: { projectId, investigationId, dataId },
			error,
			request,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permission = await canRead(session.user.id, projectId);
			if (!permission) return error(403, "Forbidden");

			try {
				const data = await getDataById(investigationId, dataId);
				if (!data) return error(404, "Not Found");

				return data;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	)
	.post(
		"/",
		async ({
			params: { projectId, investigationId },
			body,
			error,
			request,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permission = await canWrite(session.user.id, projectId);
			if (!permission) return error(403, "Forbidden");

			try {
				await createData(body, investigationId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: CreateData,
		},
	)
	.put(
		"/:dataId",
		async ({
			params: { projectId, investigationId, dataId },
			body,
			error,
			request,
			set,
		}) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permission = await canWrite(session.user.id, projectId);
			if (!permission) return error(403, "Forbidden");

			try {
				await editData(body, investigationId, dataId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
		{
			body: EditData,
		},
	)
	.delete(
		"/:dataId",
		async ({ params: { projectId, dataId }, error, request, set }) => {
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session?.session) return error(401, "Unauthorized");

			const permission = await canWrite(session.user.id, projectId);
			if (!permission) return error(403, "Forbidden");

			try {
				await deleteData(dataId);
				set.status = 204;
			} catch {
				return error(500, "Internal Server Error");
			}
		},
	);
