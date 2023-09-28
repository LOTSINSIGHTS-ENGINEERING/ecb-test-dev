export const getFirstDateOfMonth = (month?: number, year?: number): Date => {
  const date = new Date();
  if (year !== undefined) date.setFullYear(year);
  if (month !== undefined) date.setMonth(month);
  date.setDate(1);

  return date;
};

export const getLastDateOfMonth = (month?: number, year?: number): Date => {
  const date = new Date();
  if (year !== undefined) date.setFullYear(year);

  if (month !== undefined) date.setMonth(month + 1);
  else date.setMonth(date.getMonth() + 1);
  date.setDate(0);

  return date;
};

// Get the day on 1st of the month.
export const getFirstAndLastDateOfMonth = (month?: number, year?: number) => {
  const firstDate = getFirstDateOfMonth(month, year);
  const lastDate = getLastDateOfMonth(month, year);

  return {
    firstDate,
    lastDate,
  };
};
