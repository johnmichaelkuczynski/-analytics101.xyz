import { chatJson } from "./ai";

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[\u2212\u2010-\u2015]/g, "-")
    .replace(/[$,]/g, "")
    .replace(/[)(\[\]{}]/g, "")
    .replace(/\s*=\s*/g, "=");
}

function asNumber(s: string): number | null {
  const cleaned = s.replace(/[$,%\s]/g, "").replace(/[\u2212]/g, "-");
  if (/^-?\d+(\.\d+)?$/.test(cleaned)) return parseFloat(cleaned);
  const frac = cleaned.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (frac) {
    const n = parseFloat(frac[1]!);
    const d = parseFloat(frac[2]!);
    if (d !== 0) return n / d;
  }
  return null;
}

export async function gradeAnswer(opts: {
  prompt: string;
  correctAnswer: string;
  userAnswer: string;
}): Promise<{ correct: boolean; explanation: string }> {
  const user = opts.userAnswer ?? "";
  const correct = opts.correctAnswer ?? "";

  if (normalize(user) === normalize(correct)) {
    return {
      correct: true,
      explanation: `Correct. ${correct}`,
    };
  }

  const u = asNumber(user);
  const c = asNumber(correct);
  if (u != null && c != null) {
    const tol = Math.max(0.01, Math.abs(c) * 0.01);
    if (Math.abs(u - c) <= tol) {
      return { correct: true, explanation: `Correct. The expected answer is ${correct}.` };
    }
  }

  try {
    const out = await chatJson<{ correct: boolean; explanation: string }>(
      "You grade short college ethics answers. Decide if the student's answer is semantically equivalent to the correct/model answer — accept paraphrases, synonyms, and answers that capture the same key idea or reach the same verdict (e.g. 'descriptive' vs 'it's descriptive', 'no, because origin doesn't affect truth' vs 'no'). Be lenient about wording but strict about the substantive point. Output strict JSON {\"correct\": boolean, \"explanation\": string} where explanation is 1-3 short sentences and includes the correct answer.",
      JSON.stringify({
        prompt: opts.prompt,
        correct_answer: correct,
        student_answer: user,
      }),
    );
    return {
      correct: !!out.correct,
      explanation: out.explanation || `The correct answer is ${correct}.`,
    };
  } catch {
    return {
      correct: false,
      explanation: `The correct answer is ${correct}.`,
    };
  }
}

// Rich, coaching-style feedback for PRACTICE assignments. Unlike gradeAnswer
// (which returns a terse 1-3 sentence verdict for graded work), this returns
// generous, structured feedback designed to help a student improve before they
// sit the real graded version. Practice is never penalized, so feedback leans
// encouraging and specific.
export async function gradePracticeEssay(opts: {
  prompt: string;
  correctAnswer: string;
  userAnswer: string;
}): Promise<{ correct: boolean; feedback: string }> {
  const user = (opts.userAnswer ?? "").trim();
  const correct = opts.correctAnswer ?? "";

  if (!user) {
    return {
      correct: false,
      feedback: `You left this one blank. Give it a real attempt — even a rough draft — and resubmit for feedback.\n\n**Model answer:** ${correct}`,
    };
  }

  try {
    const out = await chatJson<{
      correct: boolean;
      feedback: string;
    }>(
      "You are a warm, rigorous college ethics tutor grading a PRACTICE answer (never penalized — the goal is to help the student improve before the real graded version). Compare the student's answer to the model answer. Decide `correct` = true if it captures the substantive point (accept paraphrases and equivalent reasoning), false otherwise. Then write `feedback` as encouraging Markdown with these sections: **What you got right** (be specific, cite their wording), **What's missing or off** (the key gaps vs. the model answer), and **How to strengthen it** (1-2 concrete next steps). 4-8 sentences total. Always weave in the core idea of the model answer so they can compare. Output strict JSON {\"correct\": boolean, \"feedback\": string}.",
      JSON.stringify({
        prompt: opts.prompt,
        model_answer: correct,
        student_answer: user,
      }),
    );
    return {
      correct: !!out.correct,
      feedback:
        out.feedback ||
        `Here's the model answer to compare against:\n\n${correct}`,
    };
  } catch {
    return {
      correct: false,
      feedback: `I couldn't reach the grader just now. Compare your answer against the model answer and try again:\n\n**Model answer:** ${correct}`,
    };
  }
}
