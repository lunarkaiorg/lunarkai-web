import { IMemory } from "./memory";
import { ITransaction } from "./transaction";

export interface IMessage {
    id: string;
    content: string;
    role: string;
    chatId: string;
    createdAt: Date;
    transaction?: ITransaction | null;
    memory?: IMemory | null;
    toolData?: string | null;
    streamParts?: string[];
}