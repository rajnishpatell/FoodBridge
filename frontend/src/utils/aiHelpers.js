export function getAIScore(riskScore) {
  const score = Math.round((1 - riskScore) * 100);

  let label = "";
  let color = "";
  let advice = "";

  if (score >= 80) {
    label = "Safe";
    color = "green";
    advice = "Fresh and safe to consume";
  } else if (score >= 50) {
    label = "Moderate";
    color = "yellow";
    advice = "Consume soon (within 2–3 hrs)";
  } else {
    label = "Risky";
    color = "red";
    advice = "High risk — avoid if possible";
  }

  return { score, label, color, advice };
}