const normalizeText = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
};

const getDistance = (source: string, target: string) => {
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
  const responseNormalized = normalizeText(responseText);
  const transcriptNormalized = normalizeText(targetTranscript);
  
  const minutesSpent = Math.max(timeTaken / 60, 1 / 60);
  const responseStandardWords = responseNormalized.length / 5;
  const actualWpm = Math.max(0, Math.round(responseStandardWords / minutesSpent));
  
  const distance = getDistance(responseNormalized, transcriptNormalized);
  const referenceLength = Math.max(transcriptNormalized.length, 1);
  const accuracy = Math.max(0, Math.round(((referenceLength - distance) / referenceLength) * 100));
  const score = Math.max(0, Math.min(100, Math.round(accuracy * 0.7 + Math.min(actualWpm, targetWpm) * 0.3)));

  const missingChars = Math.max(transcriptNormalized.length - responseNormalized.length, 0);
  const extraChars = Math.max(responseNormalized.length - transcriptNormalized.length, 0);
  const mismatchEstimate = Math.max(distance - Math.abs(responseNormalized.length - transcriptNormalized.length), 0);

  const errorAnalysis = [
    `Reference length: ${transcriptNormalized.length} characters. Your response length: ${responseNormalized.length} characters.`,
    `Estimated missing characters: ${missingChars}, extra characters: ${extraChars}, mismatched characters: ${mismatchEstimate}.`,
    actualWpm >= targetWpm
      ? `Your speed met the ${targetWpm} WPM target. Focus next on reducing mismatched characters.`
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
    normalizedResponseText: responseNormalized,
  };
};
