import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Helmet } from "react-helmet-async";

import { FeaturesSection } from "./sections/features";
import { HeroSection } from "./sections/hero";
import { TemplatesSection } from "./sections/templates";

export const HomePage = () => {
  const { i18n } = useLingui();

  return (
    <main className="relative isolate bg-background">
      <Helmet prioritizeSeoTags>
        <html lang={i18n.locale} />

        <title>
          {t`ResumeU`} - {t`Resume builder`}
        </title>

        <meta
          name="description"
          content="A free resume builder that simplifies the process of creating, updating, and sharing your resume."
        />
      </Helmet>

      <HeroSection />
      <FeaturesSection />
      <TemplatesSection />
    </main>
  );
};
