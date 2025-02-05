import { Button } from "@/components/ui/button";
import { IconMap } from "@/components/icon-map";
import { portfolioConfig } from "@/config/portfolio.config";
import { ScheduleCallPopup, ScheduleCallFloat } from "@/components/calcom";
import Link from "next/link";

export const Socials = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ScheduleCallPopup />
      <ScheduleCallFloat />
      <Button
        variant="outline"
        className="active:border-b active:scale-[0.97] hover:border-b-4 hover:border-primary/30 hover:bg-background shadow-none transition-all duration-100"
        asChild
      >
        <Link href={portfolioConfig.resume}>
          Resume
        </Link>
      </Button>
      {Object.keys(portfolioConfig.links).map((key: string) => {
        const link =
          portfolioConfig.links[key as keyof typeof portfolioConfig.links];
        return (
          <Button
            key={key}
            size="icon"
            variant="outline"
            className="active:border-b active:scale-[0.97] hover:border-[0.2px] hover:border-b-4 hover:border-primary/30 hover:bg-background shadow-none transition-all duration-100"
            asChild
          >
            <a href={link} target="_blank">
              {IconMap[key as keyof typeof IconMap]}
              <span className="sr-only">{`${key} - ${link}`}</span>
            </a>
          </Button>
        );
      })}
    </div>
  );
};
