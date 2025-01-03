import { Brain } from "iconoir-react";

interface LongTermMemoryProps {
  memory: {
    content: string;
    type: string;
    importance: number;
    metadata?: string;
  };
}

const LongTermMemory = ({ memory }: LongTermMemoryProps) => {
  return (
    <div className="flex w-fit items-center px-4 py-2 mt-4 mb-2 border border-green-200 rounded-lg bg-green-50 dark:bg-green-950 dark:border-green-800">
      <Brain className="w-5 h-5 mr-3 text-green-600 dark:text-green-400" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          Long-Term Memory Stored
        </span>
        {/* 
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {memory.content}
          </span>
        */}
      </div>
    </div>
  );
};

export default LongTermMemory;