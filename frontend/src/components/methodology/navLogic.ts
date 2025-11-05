export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(length - 1, index));
}

export function getNextIndex(current: number, length: number): number {
  return clampIndex(current + 1, length);
}

export function getPrevIndex(current: number, length: number): number {
  return clampIndex(current - 1, length);
}


