import { t } from "@lingui/macro";
import { Avatar, AvatarFallback, AvatarImage, Tooltip } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";

import { useContributors } from "@/client/services/resume/contributors";

export const ContributorsSection = () => {
  const { github, crowdin, loading } = useContributors();

  const contributors = useMemo(() => {
    if (github && crowdin) return [...github, ...crowdin];
    return [];
  }, [github, crowdin]);

  return <></>;
};
