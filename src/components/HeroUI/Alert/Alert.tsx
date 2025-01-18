import React from "react";
import {Alert, Button} from "@heroui/react";

export default function PassSubmitAlert() {
  const [isVisible, setIsVisible] = React.useState(true);

  const title = "Pass Created Successfully";
  const description =
    "You have successfully created a pass for your visitor. The pass has been sent to the visitor's email address / phone.";

  return (
    <div className="flex flex-col gap-4">
      {isVisible ? (
        <Alert
          color="success"
          description={description}
          isVisible={isVisible}
          title={title}
          variant="faded"
          onClose={() => setIsVisible(false)}
        />
      ) : (
        <Button variant="bordered" onPress={() => setIsVisible(true)}>
          Show Alert
        </Button>
      )}
    </div>
  );
}

