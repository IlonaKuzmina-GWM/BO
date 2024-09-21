"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../UI/popover";
import { Calendar } from "../UI/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "../UI/button";

interface IDatePickerWithRange extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (range: DateRange | undefined) => void;
  className?: string;
  initialDate?: DateRange;
  width?: string;
}

const DatePickerWithRange = ({
  className,
  onDateChange,
  initialDate,
  width = "300px",
}: IDatePickerWithRange) => {
  const [date, setDate] = React.useState<DateRange | undefined>(initialDate || {
    from: addDays(new Date(), -5),
    to: new Date(),
  });

  React.useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  const handleDateChange = (newRange: DateRange | undefined) => {
    setDate(newRange);
    onDateChange(newRange); // Notify parent of the date range change
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          asChild
          className="rounded-sm border border-divider bg-white px-2 py-[9px] text-start text-sm text-main"
        >
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              `w-[${width}] justify-start text-left font-normal`,
              !date && "text-main",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/LL/y")} - {format(date.to, "dd/LL/y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto border-none p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            className="rounded-sm border border-divider bg-white p-2 text-start text-sm text-main"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;

// "use client";

// import * as React from "react";
// import { addDays, format } from "date-fns";
// import { DateRange } from "react-day-picker";

// import { cn } from "@/lib/utils";
// import { Popover, PopoverContent, PopoverTrigger } from "../UI/popover";
// import { Calendar } from "../UI/calendar";
// import { CalendarIcon } from "lucide-react";
// import { Button } from "../UI/button";

// export function DatePickerWithRange({
//   className,
// }: React.HTMLAttributes<HTMLDivElement>) {
//   const [date, setDate] = React.useState<DateRange | undefined>({
//     from: new Date(2022, 0, 20),
//     to: addDays(new Date(2022, 0, 20), 20),
//   });

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover >
//         <PopoverTrigger asChild className="rounded-sm border border-divider bg-white p-2 text-start text-sm text-main">
//           <Button
//             id="date"
//             variant={"outline"}
//             className={cn(
//               "w-[300px] justify-start text-left font-normal",
//               !date && "text-muted-foreground",
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "LL/dd/y")} -{" "}
//                   {format(date.to, "LL/dd/y")}
//                 </>
//               ) : (
//                 format(date.from, "LLL dd, y")
//               )
//             ) : (
//               <span>Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0 border-none" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={setDate}
//             numberOfMonths={2}
//             className="rounded-sm border border-divider bg-white p-2 text-start text-sm text-main"
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }