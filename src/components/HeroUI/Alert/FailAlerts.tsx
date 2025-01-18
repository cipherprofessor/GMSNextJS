import {Alert, Button} from "@heroui/react";

export default function FailAlert() {
  return (
    <div className="flex items-center justify-center w-full">
      <Alert
        color="danger"
        description="Something went wrong while creating the pass. Please try again."
        endContent={
          <Button color="danger" size="sm" variant="flat">
            Reload / Try Again
          </Button>
        }
        title="Failed To Create Pass"
        variant="faded"
      />
    </div>
  );
}
