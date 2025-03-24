import Elysia from "elysia";
import { projectsHandler } from "./projectHandler";
import { invetigationsHandler } from "./investigationsHandler";
import { studyHandler } from "./studyHandler";
import { assayHandler } from "./assayHandler";
import { dataHandler } from "./dataHandler";
import { factorHandlers } from "./factor";
import { materialHandlers } from "./material";
import { ontologyHandlers } from "./ontology";
import { processHandlers } from "./process";
import { personHandler } from "./personHandler";
import { protocolHandlers } from "./protocol";
import { publicationHandler } from "./publicationHandler";
import { sampleHandler } from "./sampleHandler";
import { sourceHandler } from "./sourceHandler";

export const handlers = new Elysia()
	.use(projectsHandler)
	.use(invetigationsHandler)
	.use(studyHandler)
	.use(assayHandler)
	.use(dataHandler)
	.use(factorHandlers)
	.use(materialHandlers)
	.use(ontologyHandlers)
	.use(personHandler)
	.use(processHandlers)
	.use(protocolHandlers)
	.use(publicationHandler)
	.use(sampleHandler)
	.use(sourceHandler);
