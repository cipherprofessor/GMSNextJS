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

  console.log("Current form data:", formData);

  const [actionMessage, setActionMessage] = useState("");

  const formatter = useDateFormatter({ dateStyle: "long" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit triggered. Current form data:", formData);

    // Basic validation
    if (!formData.name || !formData.email || !formData.address) {
      console.error("Missing required fields.");
      setActionMessage("Please fill in all required fields.");
      return;
    }

    try {
      console.log("Submitting data:", formData);

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
      
      console.log("Response from API:", response.data);

      // Check for success response
      if (response.status === 200) {
        setActionMessage("Pass created successfully!");
        console.log("Pass creation successful.");
      } else {
        console.error("API call failed with status:", response.status);
        setActionMessage("Failed to create pass. Please try again.");
      }
    } catch (error) {
      // Handle errors during API call
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      } else {
        console.error("General error details:", error);
      }
      setActionMessage("Failed to create pass. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
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
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            console.log("Name updated:", e.target.value);
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
            console.log("Email updated:", e.target.value);
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
            console.log("Address updated:", e.target.value);
          }}
        />

        <Input
          errorMessage="Please add reason"
          label="Reason Of Visit"
          labelPlacement="outside"
          name="reason"
          placeholder="Please add reason"
          type="text"
          onChange={(e) => {
            setFormData({ ...formData, reason: e.target.value });
            console.log("Reason updated:", e.target.value);
          }}
        />

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
              console.log("Form reset.");
            }}
          >
            Reset
          </Button>
        </div>
      </Form>
      {actionMessage && (
        <p className="mt-4 text-sm text-center">
          <strong>{actionMessage}</strong>
        </p>
      )}
    </div>
  );
}
