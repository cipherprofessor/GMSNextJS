import React, { useState } from "react";
import { DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { Form, Input, Button } from "@heroui/react";
import axios from "axios";
import PassSubmitAlert from "../Alert/Alert";  // Import your alert component

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

  const [actionMessage, setActionMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);  // For controlling alert visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.address) {
      console.error("Missing required fields.");
      setActionMessage("Please fill in all required fields.");
      return;
    }

    try {
      // Prepare data for submission
      const postData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        reason: formData.reason,
        date: {
          start: formData.dateRange.start.toString(),
          end: formData.dateRange.end.toString(),
        },
      };

      // Make the API call
      const response = await axios.post("/api/create-pass", postData);

      if (response.status === 200) {
        setActionMessage("Pass created successfully!");
        setIsAlertVisible(true); // Show the alert on success
      } else {
        console.error("API call failed with status:", response.status);
        setActionMessage("Failed to create pass. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setActionMessage("Failed to create pass. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        validationBehavior="native"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="flex flex-col gap-4"> 
                    <div className="w-full max-w-xs flex flex-col gap-4">
        <Input
          isRequired
          errorMessage="Please enter a name"
          label="Visitors Name"
          labelPlacement="outside"
          name="name"
          placeholder="Enter visitors name"
          type="text"
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
        />

        <Input
          isRequired
          errorMessage="Please enter a valid email"
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
          }}
        />

        <Input
          isRequired
          errorMessage="Please enter address"
          label="Address"
          labelPlacement="outside"
          name="address"
          placeholder="Please enter visitor's address"
          type="text"
          onChange={(e) => {
            setFormData({ ...formData, address: e.target.value });
          }}
        />
                  </div>

                  <div className="w-full max-w-xs flex flex-col gap-4">

        {/* Single Reason Of Visit Field */}
        <Input
          isRequired
          errorMessage="Please add reason"
          label="Reason Of Visit"
          labelPlacement="outside"
          name="reason"
          placeholder="Please add reason"
          type="text"
          onChange={(e) => {
            setFormData({ ...formData, reason: e.target.value });
          }}
        />

        {/* Date Range Picker - only one instance */}
        <div className="flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2 ">
        <p className="w-full max-w-xs flex flex-col gap-4 mb-2">
            Visitors Timing is 8:00 AM to 7:00 PM
        </p>

          <DateRangePicker
            isRequired
            value={formData.dateRange}
            label="Please Select Pass validity"
            errorMessage="Please select a date range"
            onChange={(range) => {
              if (range) {
                setFormData({ ...formData, dateRange: range });
              }
            }}
          />
        </div>
        </div>

        </div>
                </div>

        <div className="flex gap-2 mt-4">
          <Button color="primary" type="submit">
            Create Pass
          </Button>
          <Button
            type="reset"
            variant="flat"
            onPress={() => {
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

      {isAlertVisible && <PassSubmitAlert />}  {/* Show alert when API call succeeds */}

      {actionMessage && (
        <p className="mt-4 text-sm text-center">
          <strong>{actionMessage}</strong>
        </p>
      )}
    </div>
  );
}
