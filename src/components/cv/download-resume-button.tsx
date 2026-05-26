"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadResumeButton({
  href,
  filename,
}: {
  href: string;
  filename: string;
}) {
  return (
    <Button
      asChild
      className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <a href={href} download={filename}>
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </a>
    </Button>
  );
}
