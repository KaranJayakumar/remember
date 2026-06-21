export function getRelativeTime(unixTimestamp : number) {
  const ms = unixTimestamp < 1e11 ? unixTimestamp * 1000 : unixTimestamp;
  const delta = ms - Date.now();
  
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  const divisions: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' }
  ];

  let duration = delta / 1000;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

