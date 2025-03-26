import research from "./research.json"
import resources from "./resources.json"
import Scripture from "./Scripture.json"
import statements from "./statements.json"
import why from "./why.json"

import { dimensions } from "./questions"

export const principles = Object.fromEntries(dimensions.map((dimension) => [
    dimension,
    {
        research: research[dimension],
        resources: resources[dimension],
        Scripture: Scripture[dimension],
        statements: statements[dimension],
        why: why[dimension]
    }
]))