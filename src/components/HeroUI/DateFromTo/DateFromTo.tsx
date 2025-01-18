
import React from "react";
import {DateRangePicker} from "@heroui/react";
import {parseDate, getLocalTimeZone} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";
import {Form, Input, Button} from "@heroui/react";

export default function HeroUIDateRangePicker() {
  const [value, setValue] = React.useState({
    start: parseDate("2025-01-01"),
    end: parseDate("2025-01-08"),
  });

  let formatter = useDateFormatter({dateStyle: "long"});

  return (
    <div className="flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2 ">
      <p className="w-full max-w-xs flex flex-col gap-4 mb-2">
            Visitors Timing is 8:00 AM to 7:00 PM
        </p>
        <DateRangePicker
          isRequired
          label="Please Select Pass validity"
          errorMessage="Please select a date range"
          value={value}
          onChange={(newValue) => {
            if (newValue) {
              setValue(newValue);
            }
          }}
        />
        <p className="text-default-500 text-sm mt-3">
          Selected date:{" "}
          {value
            ? formatter.formatRange(
                value.start.toDate(getLocalTimeZone()),
                value.end.toDate(getLocalTimeZone()),
              )
            : "--"}
        </p>
        
        <div className="flex flex-column gap-2 mt-5">
        <Input
        errorMessage="Please add reason"
        label="Reason Of Visit"
        labelPlacement="outside"
        name="Reason Of Visit"
        placeholder="Please add reason"
        type="text"
      />
      </div>
      </div>
    </div>
  );
}

