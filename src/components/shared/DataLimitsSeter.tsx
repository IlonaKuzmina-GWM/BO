import React from "react";
import { Button } from "../UI/button";

interface DataLimitsSeterProps {
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export default function DataLimitsSeter({
  defaultValue = 10,
  onChange,
}: DataLimitsSeterProps) {
  const [activeLimit, setActiveLimit] = React.useState(defaultValue);
  const limits = [10, 25, 50, 100];

  const handleLimitChange = (limit: number) => {
    setActiveLimit(limit);
    onChange?.(limit);
  };

  return (
    <div className="absolute left-0 w-full max-w-sm pl-3">
      <div className="flex flex-row items-center">
        <span className="inline-block text-[14px]">Limits:</span>
        <div className="flex flex-wrap gap-1" id="page-limit">
          {limits.map((limit) => (
            <Button
              key={limit}
              variant={activeLimit === limit ? "limitsActive" : "default"}
              size="sm"
              onClick={() => handleLimitChange(limit)}
            >
              {limit}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
