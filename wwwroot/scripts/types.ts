export type Recipe = {
    id: number;
    title: string;
    slug: string | null;
    introduction: string | null;
    objective: string | null;
    ingredients: string;
    preparation: string | null;
    execution: string;
    reflection: string | null;
    variation: string | null;
    category: string | null;
    timeEstimate: string | null;
    difficulty: string | null;
    source: string | null;
};
