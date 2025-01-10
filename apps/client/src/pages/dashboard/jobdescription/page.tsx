import { t } from "@lingui/macro";
import { CircleNotch } from "@phosphor-icons/react";
import { Button } from "@reactive-resume/ui";
import { useState } from "react";

import { createJobDescription } from "../../../services/openai/improve-writing";

export function JobDescription() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">{t`Create Job Description:`}</h2>
      <form className="flex max-w-[500px] flex-col space-y-3">
        <textarea
          placeholder={t`Write a job description...`}
          style={{ color: "#000", height: 200, borderRadius: 2 }}
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
          }}
        />
        <Button
          type="button"
          disabled={!!loading}
          onClick={async () => {
            setLoading(true);
            const x = await createJobDescription(jobDescription);
            setLoading(false);
            console.log(x);
            setJobDescription(x);
          }}
        >
          {loading && <CircleNotch className="animate-spin" />}&nbsp;
          {t`Improve Job Description with AI`}
        </Button>
      </form>
    </>
  );
}
