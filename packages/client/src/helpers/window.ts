/* eslint-disable @typescript-eslint/no-empty-function */
const windowSsr = {
  localStorage: {
    key: () => null,
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
    clear: () => null,
  },
  addEventListener() {},
  removeEventListener() {},
  innerWidth: 500,
  innerHeight: 500,
};

const win: Window | typeof windowSsr =
  typeof window !== 'undefined' ? window : windowSsr;

export default win;