const AMOUNT_COUNT = 10;
const FILTER_NAMES = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * AMOUNT_COUNT),
    };
  });
};

export {generateFilters};
