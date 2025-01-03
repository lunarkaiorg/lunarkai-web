export interface IMemory {
    id: string;
    content: string;
    type: string;
    userId: string;
    chatId?: string;
    importance: number;
    timestamp: Date;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}