export const sleep = (time: number): Promise<void> =>
  new Promise((s) => setTimeout(s, time));

export const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const cleanNullOrUndefined = (
  obj: Record<string, string | string[] | null | undefined>
): Record<string, string> => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj as Record<string, string>;
};
