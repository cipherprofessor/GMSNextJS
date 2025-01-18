import React from "react";
import {Form, Input, Button} from "@heroui/react";

export default function CreatePassForm() {
  const [action, setAction] = React.useState("");

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4"
      validationBehavior="native"
      onReset={() => setAction("reset")}
      onSubmit={(e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));

        setAction(`submit ${JSON.stringify(data)}`);
      }}
    >
      <Input
        isRequired
        errorMessage="Please enter a name"
        label="Visitors Name"
        labelPlacement="outside"
        name="username"
        placeholder="Enter visitors name"
        type="text"
      />

      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
      />

        <Input
        isRequired
        errorMessage="Please enter address"
        label="Address"
        labelPlacement="outside"
        name="email"
        placeholder="Please enter visitor's address"
        type="text"
      />

      <div className="flex gap-2">
        <Button color="primary" type="submit">
          Create
        </Button>
        <Button type="reset" variant="flat">
          Reset
        </Button>
      </div>
      {action && (
        <div className="text-small text-default-500">
          {/* Action: <code>{action}</code> */}
        </div>
      )}
    </Form>
  );
}

