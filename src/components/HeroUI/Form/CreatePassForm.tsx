import React, { useState } from "react";
import { DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { Form, Input, Button } from "@heroui/react";
import axios from "axios";
import PassSubmitAlert from "../Alert/Alert";  // Import your alert component
import FailAlert from "../Alert/FailAlerts";  // Assuming you have a FailAlert component for errors

export default function CreateVisitorsPass() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    reason: "",
    phone: "",
    dateRange: {
      start: parseDate("2025-01-01"),
      end: parseDate("2025-01-08"),
    },
  });

  const [actionMessage, setActionMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);  // For success alert
  const [isFailAlertVisible, setIsFailAlertVisible] = useState(false);  // For failure alert
  const [isLoading, setIsLoading] = useState(false);  // For loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);  // Start loading

    try {
      // Prepare data for submission
      const postData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        reason: formData.reason,
        phone: formData.phone,
        date: {
          start: formData.dateRange.start.toString(),
          end: formData.dateRange.end.toString(),
        },
      };

      // Make the API call
      const response = await axios.post("/api/create-pass", postData);

      if (response.status >= 200 && response.status < 300) {
        // Success: Reset form data and show success alert
        setFormData({
          name: "",
          email: "",
          address: "",
          reason: "",
          phone: "",
          dateRange: {
            start: parseDate("2025-01-01"),
            end: parseDate("2025-01-08"),
          },
        });

        setIsAlertVisible(true);  
        setIsFailAlertVisible(false); 

        // Hide success alert after 5 seconds
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 4000);
      } else {
        setIsFailAlertVisible(true);
        setIsAlertVisible(false);

        // Hide failure alert after 5 seconds
        setTimeout(() => {
          setIsFailAlertVisible(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      
      setIsFailAlertVisible(true);
      setIsAlertVisible(false);

      // Hide failure alert after 5 seconds
      setTimeout(() => {
        setIsFailAlertVisible(false);
      }, 5000);
    } finally {
      setIsLoading(false);  // Stop loading
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Form
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6"
        validationBehavior="native"
        onSubmit={(e) => handleSubmit(e)}  
      >
        {/* Left side form inputs */}
        <div className="flex flex-col gap-4">
          <Input
            isRequired
            errorMessage="Please enter a name"
            label="Visitors Name"
            labelPlacement="outside"
            name="name"
            placeholder="Enter visitors name"
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />

          {/* Phone Number Input */}
          <Input
            isRequired
            errorMessage="Please enter phone number"
            label="Phone Number"
            labelPlacement="outside"
            name="phone"
            placeholder="Enter your phone number"
            type="number"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
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
            value={formData.address}
            onChange={(e) => {
              setFormData({ ...formData, address: e.target.value });
            }}
          />
        </div>

        {/* Right side form inputs */}
        <div className="flex flex-col gap-4">
          <Input
            isRequired
            errorMessage="Please add reason"
            label="Reason Of Visit"
            labelPlacement="outside"
            name="reason"
            placeholder="Please add reason"
            type="text"
            value={formData.reason}
            onChange={(e) => {
              setFormData({ ...formData, reason: e.target.value });
            }}
          />

          <Input
            errorMessage="Please enter a valid email"
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />

          <div className="flex flex-col gap-y-2">
            <DateRangePicker
              isRequired
              value={formData.dateRange}
              label="Please Select Dates. Timing is 8:00 AM to 7:00 PM"
              labelPlacement="outside"
              errorMessage="Please select a date range"
              onChange={(range) => {
                if (range) {
                  setFormData({ ...formData, dateRange: range });
                }
              }}
            />
          </div>
        </div>

        {/* Create Pass and Reset buttons */}
        <div className="col-span-2 flex gap-4 justify-center">
          <Button color="primary" type="submit" isDisabled={isLoading}>
            {isLoading ? "Creating..." : "Create Pass"}
          </Button>
          <Button
            type="reset"
            variant="flat"
            onPress={() => {
              // Reset form to initial state
              setFormData({
                name: "",
                email: "",
                address: "",
                reason: "",
                phone: "",
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

      {isAlertVisible && <PassSubmitAlert />} 
      {isFailAlertVisible && <FailAlert />}   

      {actionMessage && (
        <p className="mt-4 text-sm text-center">
          <strong>{actionMessage}</strong>
        </p>
      )}
    </div>
  );
}