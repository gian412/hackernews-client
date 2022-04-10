export interface HNItem {
    id: number;
    type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
    by: string;
    time: number;
    title?: string;
    text?: string;
    deleted?: boolean;
    parent?: number;
    kids?: number[];
    url?: string;
    score?: number;
    descendants?: number;
}
