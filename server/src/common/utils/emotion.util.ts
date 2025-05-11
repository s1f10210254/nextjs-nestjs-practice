export const mapColorToEmotion = (color: string): number => {
  const map: Record<string, number> = {
    blue: 1,
    green: 2,
    yellow: 3,
    orange: 4,
    red: 5,
  };
  return map[color] ?? 3; // デフォルトはyellow相当
};
