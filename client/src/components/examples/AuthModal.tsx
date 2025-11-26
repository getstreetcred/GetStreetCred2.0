import { useState } from "react";
import AuthModal from "../AuthModal";
import { Button } from "@/components/ui/button";

export default function AuthModalExample() {
  const [open, setOpen] = useState(true);
  const [defaultTab, setDefaultTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          setDefaultTab("signin");
          setOpen(true);
        }}
      >
        Open Sign In
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setDefaultTab("signup");
          setOpen(true);
        }}
      >
        Open Sign Up
      </Button>
      <AuthModal open={open} onOpenChange={setOpen} defaultTab={defaultTab} />
    </div>
  );
}
