export type Recipe = {
    id: number;
    title: string;
    description: string | null;
    ingredients: string;
    instructions: string;
    category: string | null;
    servings: number | null;
    prepMinutes: number | null;
    cookMinutes: number | null;
    source: string | null;
};
