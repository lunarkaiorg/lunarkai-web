export interface ITransaction {
    id: string;
    messageId: string;
    data: any;
    hash?: string | null;
    createdAt: Date;
    updatedAt: Date;
}