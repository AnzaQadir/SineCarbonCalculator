import { clampIndex, getNextIndex, getPrevIndex } from '@/components/methodology/navLogic';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

// Basic unit checks for nav logic
(() => {
  assert(clampIndex(-1, 4) === 0, 'clamp below 0');
  assert(clampIndex(10, 4) === 3, 'clamp above length');
  assert(getNextIndex(0, 4) === 1, 'next from 0');
  assert(getPrevIndex(0, 4) === 0, 'prev stays at 0');
  assert(getNextIndex(3, 4) === 3, 'next stays at last');
})();


