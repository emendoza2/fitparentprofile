// Define types for our data structures
export interface ResearchItem {
    text: string;
    citation: string;
}

export interface ResourceItem {
    category: string;
    free: boolean;
    title: string;
    url: string;
    description: string;
}

export interface ScriptureItem {
    reference: string;
    text: string;
}

export interface StatementItem {
    statement: string;
    action: string;
}

// export interface DimensionItem {
//     why: string;
//     description: string;
//     welcome: string;
//     levels: string[]; // Array of level descriptions
// }

export interface PrincipleData {
    research: ResearchItem[];
    resources: ResourceItem[];
    Scripture: ScriptureItem[];
    statements: StatementItem[];
    why: string;
    description: string;
    welcome: {
        title: string;
        description: string;
    };
    levels: string[]; // Array of level descriptions
    // dimensions: DimensionItem[];
}

export interface PrinciplesData {
    [dimension: string]: PrincipleData;
} 