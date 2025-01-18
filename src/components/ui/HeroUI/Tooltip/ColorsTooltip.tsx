import {Tooltip, Button} from "@heroui/react";

export default function HeroUIColoursTooltip() {
  const colors: Array<"default" | "primary" | "secondary" | "success" | "warning" | "danger"> = ["default", "primary", "secondary", "success", "warning", "danger"];

  return (
    <div className="flex flex-wrap gap-4">
      {colors.map((color) => {
        return (
          <Tooltip key={color} className="capitalize" color={color} content={color}>
            <Button className="capitalize" color={color} variant="flat">
              {color}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );
}
