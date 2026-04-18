export const calculateRiskScore = (foodType, preparedAt, temperature) => {
  const now = new Date();
  const prepTime = new Date(preparedAt);

  const hoursElapsed = (now - prepTime) / (1000 * 60 * 60);

  const safeLimits = {
    VEG: 6,
    NON_VEG: 4,
    RAW: 8,
    DRY: 12
  };

  const safeTime = safeLimits[foodType];

  const timeFactor = hoursElapsed / safeTime;

  const tempFactor =
    temperature > 35 ? 1 :
    temperature > 25 ? 0.7 : 0.4;

  const typeRisk =
    foodType === "NON_VEG" ? 1 :
    foodType === "VEG" ? 0.6 :
    foodType === "RAW" ? 0.5 : 0.3;

  const riskScore =
    (timeFactor * 0.5) +
    (tempFactor * 0.3) +
    (typeRisk * 0.2);

  return Math.min(riskScore, 1);
};