import Elysia from "elysia";
import { projectsHandler } from "./projectHandler";
import { invetigationsHandler } from "./investigationsHandler";
import { assayHandlers } from "./assay";
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
import { studyHandlers } from "./study";

export const handlers = new Elysia()
	.use(projectsHandler)
	.use(invetigationsHandler)
	.use(studyHandlers)
	.use(assayHandlers)
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
