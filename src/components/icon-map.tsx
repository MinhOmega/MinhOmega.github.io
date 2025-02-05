import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  GlobeIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
  VideoIcon
} from "@radix-ui/react-icons";
import { FacebookIcon, Mail, Phone } from "lucide-react";
import AppStoreIcon from "./icons/appstore";
import GooglePlayIcon from "./icons/google-play";

export const IconMap = {
  github: <GitHubLogoIcon />,
  twitter: <TwitterLogoIcon />,
  discord: <DiscordLogoIcon />,
  linkedin: <LinkedInLogoIcon />,
  instagram: <InstagramLogoIcon />,
  website: <GlobeIcon />,
  youtube: <VideoIcon />,
  mail: <Mail size={16} />,
  phone: <Phone size={16} />,
  facebook: <FacebookIcon />,
  appstore: <AppStoreIcon />,
  googleplay: <GooglePlayIcon />,
};
