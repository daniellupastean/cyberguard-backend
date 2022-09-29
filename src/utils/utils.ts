export function getRank(realPercentage: number) {
  let rankName = null;
  let rankNumber = null;
  if (realPercentage < 50) {
    rankName = 'Untrusted';
    rankNumber = 1;
  } else if (realPercentage <= 70) {
    rankName = 'Poor realiability';
    rankNumber = 2;
  } else if (realPercentage <= 80) {
    rankName = 'Reliable';
    rankNumber = 3;
  } else if (realPercentage <= 90) {
    rankName = 'Very reliable';
    rankNumber = 4;
  } else if (realPercentage <= 100) {
    rankName = 'Most reliable';
    rankNumber = 5;
  }
  return { rankName, rankNumber };
}
