/* eslint-disable lingui/text-restrictions */

import { t } from "@lingui/macro";

import { openai } from "./client";
import { useOpenAiStore } from "@/client/stores/openai";
import { DEFAULT_MAX_TOKENS, DEFAULT_MODEL } from "@/client/constants/llm";

const PROMPT = `You are an AI writing assistant specialized in writing copy for resumes.
Do not return anything else except the text you improved. It should not begin with a newline. It should not have any prefix or suffix text.
Improve the writing of the following paragraph and returns in the language of the text:

Text: """{input}"""

Revised Text: """`;

const PROMPTJD = `Create a detailed job description based on the following input: {input}. Use the information provided to craft a comprehensive job posting. Include the following sections:

Job Title: Derive the job title from the input summary. Add any relevant keywords if necessary.
Location: Mention the location or specify if the role is remote.
Job Type: Indicate whether the position is full-time, part-time, or contract.
Experience Level: Define the level of experience required (e.g., Junior, Mid, Senior, or specific years of experience).
About Us: Write a brief and engaging company overview, focusing on the industry, mission, and company culture.
Job Summary: Summarize the role’s main responsibilities and its impact within the organization.
Key Responsibilities: List the specific tasks and duties aligned with the role described in the input summary.
Requirements: Outline the technical skills, tools, and qualifications essential for the role.
Nice to Have: Include any additional skills or experiences that would be beneficial but not mandatory.
What We Offer: Highlight the benefits, perks, and professional growth opportunities available.
How to Apply: Provide clear instructions for submitting an application, including any required documents.
Equal Opportunity Statement: Add a commitment to diversity and inclusion.
Make the tone professional yet approachable and tailor the content to attract candidates who are passionate about the role.`;

export const improveWriting = async (text: string) => {
  const prompt = PROMPT.replace("{input}", text);

  const { model, maxTokens } = useOpenAiStore.getState();

  const result = await openai().chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: model ?? DEFAULT_MODEL,
    max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
    temperature: 0,
    stop: ['"""'],
    n: 1,
  });

  if (result.choices.length === 0) {
    throw new Error(t`OpenAI did not return any choices for your text.`);
  }

  return result.choices[0].message.content ?? text;
};

export const createJobDescription = async (text: string) => {
  const prompt = PROMPTJD.replace("{input}", text);
  console.log(prompt, "prompt");

  const { model, maxTokens } = useOpenAiStore.getState();

  const result = await openai().chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: model ?? DEFAULT_MODEL,
    max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
    temperature: 0,
    stop: ['"""'],
    n: 1,
  });

  if (result.choices.length === 0) {
    throw new Error(t`OpenAI did not return any choices for your text.`);
  }

  return result.choices[0].message.content ?? text;
};
