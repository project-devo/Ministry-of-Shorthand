const normalizeText = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const tokenize = (value: string) => {
  const normalized = normalizeText(value);
  return normalized ? normalized.split(" ") : [];
};

const getWordDistance = (source: string[], target: string[]) => {
  const matrix = Array.from({ length: source.length + 1 }, (_, rowIndex) =>
    Array.from({ length: target.length + 1 }, (_, columnIndex) => {
      if (rowIndex === 0) {
        return columnIndex;
      }

      if (columnIndex === 0) {
        return rowIndex;
      }

      return 0;
    }),
  );

  for (let rowIndex = 1; rowIndex <= source.length; rowIndex += 1) {
    for (let columnIndex = 1; columnIndex <= target.length; columnIndex += 1) {
      if (source[rowIndex - 1] === target[columnIndex - 1]) {
        matrix[rowIndex][columnIndex] = matrix[rowIndex - 1][columnIndex - 1];
        continue;
      }

      matrix[rowIndex][columnIndex] = Math.min(
        matrix[rowIndex - 1][columnIndex] + 1,
        matrix[rowIndex][columnIndex - 1] + 1,
        matrix[rowIndex - 1][columnIndex - 1] + 1,
      );
    }
  }

  return matrix[source.length][target.length];
};

export const evaluateDictationAttempt = ({
  responseText,
  targetTranscript,
  targetWpm,
  timeTaken,
}: {
  responseText: string;
  targetTranscript: string;
  targetWpm: number;
  timeTaken: number;
}) => {
  const responseWords = tokenize(responseText);
  const transcriptWords = tokenize(targetTranscript);
  const minutesSpent = Math.max(timeTaken / 60, 1 / 60);
  const actualWpm = Math.max(0, Math.round(responseWords.length / minutesSpent));
  const distance = getWordDistance(responseWords, transcriptWords);
  const referenceWordCount = Math.max(transcriptWords.length, 1);
  const accuracy = Math.max(0, Math.round(((referenceWordCount - distance) / referenceWordCount) * 100));
  const score = Math.max(0, Math.min(100, Math.round(accuracy * 0.7 + Math.min(actualWpm, targetWpm) * 0.3)));

  const missingWords = Math.max(transcriptWords.length - responseWords.length, 0);
  const extraWords = Math.max(responseWords.length - transcriptWords.length, 0);
  const mismatchEstimate = Math.max(distance - Math.abs(responseWords.length - transcriptWords.length), 0);

  const errorAnalysis = [
    `Reference length: ${transcriptWords.length} words. Your response length: ${responseWords.length} words.`,
    `Estimated missing words: ${missingWords}, extra words: ${extraWords}, mismatched words: ${mismatchEstimate}.`,
    actualWpm >= targetWpm
      ? `Your speed met the ${targetWpm} WPM target. Focus next on reducing mismatched words.`
      : `Your current speed is below the ${targetWpm} WPM target. Focus on finishing more of the dictation before pushing speed.`,
    accuracy >= 85
      ? "Accuracy is strong. Repeat the dictation at a higher playback speed to improve exam readiness."
      : "Accuracy needs work. Re-listen at a slower playback speed and compare difficult phrases against the reference pattern.",
  ];

  return {
    score,
    accuracy,
    actualWpm,
    errorAnalysis,
    normalizedResponseText: normalizeText(responseText),
  };
};
