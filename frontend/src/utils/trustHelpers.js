export function getDonorTrust(foods) {
  const totalMeals = foods.reduce((sum, f) => sum + (f.quantity || 0), 0);
  const completed = foods.filter(f => f.status === "COLLECTED").length;

  const score = Math.min(100, Math.round((completed * 10) + totalMeals * 0.5));

  let badge = "New Donor";

  if (score > 80) badge = "🏆 Top Donor";
  else if (score > 50) badge = "⭐ Reliable";
  else if (score > 20) badge = "👍 Active";

  return { score, badge };
}

export function getNgoTrust(foods) {
  const total = foods.length;
  const completed = foods.filter(f => f.status === "COLLECTED").length;

  const efficiency = total === 0 ? 0 : Math.round((completed / total) * 100);

  let badge = "New NGO";

  if (efficiency > 80) badge = "🏆 Fast NGO";
  else if (efficiency > 50) badge = "⭐ Trusted NGO";
  else if (efficiency > 20) badge = "👍 Active";

  return { efficiency, badge };
}