
import React from "react";
import {DateRangePicker} from "@heroui/react";
import {parseDate, getLocalTimeZone} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

export default function HeroUIDateRangePicker() {
  const [value, setValue] = React.useState({
    start: parseDate("2024-04-01"),
    end: parseDate("2024-04-08"),
  });

  let formatter = useDateFormatter({dateStyle: "long"});

  return (
    <div className="flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2">
        <DateRangePicker
          label="Date range (controlled)"
          value={value}
          onChange={(newValue) => {
            if (newValue) {
              setValue(newValue);
            }
          }}
        />
        <p className="text-default-500 text-sm">
          Selected date:{" "}
          {value
            ? formatter.formatRange(
                value.start.toDate(getLocalTimeZone()),
                value.end.toDate(getLocalTimeZone()),
              )
            : "--"}
        </p>
      </div>
      <DateRangePicker
        defaultValue={{
          start: parseDate("2024-04-01"),
          end: parseDate("2024-04-08"),
        }}
        label="Date range (uncontrolled)"
      />
    </div>
  );
}

