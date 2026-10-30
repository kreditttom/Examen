export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOffset(year, month) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}



export function buildGrid(year, month) {
  const daysInCurrent = getDaysInMonth(year, month);
  const offset = getFirstDayOffset(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = getDaysInMonth(prevYear, prevMonth);

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const grid = [];

  for (let i = offset - 1; i >= 0; i--) {
    grid.push({ day: daysInPrev - i, month: prevMonth, year: prevYear, current: false });
  }

  for (let d = 1; d <= daysInCurrent; d++) {
    grid.push({ day: d, month, year, current: true });
  }

  let nextDay = 1;
  while (grid.length < 42) {
    grid.push({ day: nextDay, month: nextMonth, year: nextYear, current: false });
    nextDay++;
  }

  return grid;
}




export function toDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function formatDateKey(key) {
  const [y, m, d] = key.split('-');
  return `${d}.${m}.${y}`;
}
