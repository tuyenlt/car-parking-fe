import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // wrapper các tháng
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",

        // caption (tiêu đề + nút điều hướng)
        caption: "flex justify-between items-center",
        caption_label: "text-sm font-medium",
        nav: "flex space-x-2",
        nav_button: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0 bg-transparent opacity-50 hover:opacity-100"),

        // BẢNG NGÀY: grid 7 cột
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7",
        head_cell: "text-center text-muted-foreground rounded-md py-1 text-[0.8rem]",
        row: "grid grid-cols-7 mt-2",

        // Ô ngày
        cell: cn(
          "relative p-0 text-center text-sm focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-start)]:rounded-l-md [&:has(>.day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0 font-normal aria-selected:opacity-100"),
        day_selected: "bg-primary text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_start: "aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end: "aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",

        // nếu bạn có truyền thêm classNames, giữ nguyên
        ...classNames,
      }}

      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props} />
  );
}

export { Calendar }
