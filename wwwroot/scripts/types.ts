export type IndexedItem = {
    id: number;
    fields: Record<string, string | null>;
    sections: Record<string, string | null>;
};

export type IndexData = {
    title: string;
    itemName: string;
    itemNamePlural: string;
    description: string | null;
    titleField: string;
    slugField: string;
    searchFields: string[];
    sections: string[];
    metadata: string[];
    items: IndexedItem[];
};
