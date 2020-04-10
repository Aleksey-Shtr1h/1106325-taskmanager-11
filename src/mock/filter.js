const AMOUNT_COUNT = 10;
const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * AMOUNT_COUNT),
    };
  });
};

export {generateFilters};
