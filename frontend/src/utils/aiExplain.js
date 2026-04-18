export function getAIExplanation(food) {
  const reasons = [];

  // Safety
  if (food.riskScore <= 0.3) {
    reasons.push("Safe food");
  } else if (food.riskScore <= 0.6) {
    reasons.push("Moderate freshness");
  }

  // Distance
  if (food.distanceKm && parseFloat(food.distanceKm) <= 5) {
    reasons.push("Very close");
  } else if (food.distanceKm && parseFloat(food.distanceKm) <= 15) {
    reasons.push("Nearby");
  }

  // Quantity
  if (food.quantity >= 10) {
    reasons.push("High quantity");
  } else if (food.quantity >= 5) {
    reasons.push("Good quantity");
  }

  return reasons.slice(0, 3); // limit to 3 reasons
}