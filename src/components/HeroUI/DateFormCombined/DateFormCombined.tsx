import React, { useState } from "react";
import { DateRangePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { Form, Input, Button } from "@heroui/react";
import axios from "axios";

export default function CreateVisitorsPass() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    reason: "",
    dateRange: {
      start: parseDate("2025-01-01"),
      end: parseDate("2025-01-08"),
    },
  });

  console.log("Dataa",formData);

  const [actionMessage, setActionMessage] = useState("");

  const formatter = useDateFormatter({ dateStyle: "long" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting data:", formData);
  
      const response = await axios.post("/api/create-pass", {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        reason: formData.reason,
        date: {
          start: formData.dateRange.start.toString(),
          end: formData.dateRange.end.toString(),
        },
      });
  
      console.log("Response from API:", response.data);
      setActionMessage("Pass created successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setActionMessage("Failed to create pass. Please try again.");
    }
  };
  

  return (
    <div className="flex flex-col gap-6">
      <p className="w-full max-w-xs mb-2">
        Visitors Timing is 8:00 AM to 7:00 PM
      </p>
      <DateRangePicker
        isRequired
        label="Please Select Pass Validity"
        errorMessage="Please select a date range"
        value={formData.dateRange}
        onChange={(newValue) => {
          if (newValue) {
            setFormData({ ...formData, dateRange: newValue });
          }
        }}
      />
      <p className="text-default-500 text-sm mt-3">
        Selected date: {formatter.formatRange(
          formData.dateRange.start.toDate(getLocalTimeZone()),
          formData.dateRange.end.toDate(getLocalTimeZone())
        )}
      </p>
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        validationBehavior="native"
        onSubmit={(e) => {
            console.log("Form state on submit:", formData);
            handleSubmit(e);
          }}
      >
        <Input
          isRequired
          errorMessage="Please enter a name"
          label="Visitors Name"
          labelPlacement="outside"
          name="name"
          placeholder="Enter visitors name"
          type="text"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          isRequired
          errorMessage="Please enter a valid email"
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          isRequired
          errorMessage="Please enter address"
          label="Address"
          labelPlacement="outside"
          name="address"
          placeholder="Please enter visitor's address"
          type="text"
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <Input
          errorMessage="Please add reason"
          label="Reason Of Visit"
          labelPlacement="outside"
          name="reason"
          placeholder="Please add reason"
          type="text"
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        />

        <div className="flex gap-2 mt-4">
          <Button color="primary" type="submit">
            Create Pass
          </Button>
          <Button
            type="reset"
            variant="flat"
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                address: "",
                reason: "",
                dateRange: {
                  start: parseDate("2025-01-01"),
                  end: parseDate("2025-01-08"),
                },
              });
            }}
          >
            Reset
          </Button>
        </div>
      </Form>
      {actionMessage && <p>{actionMessage}</p>}
    </div>
  );
}