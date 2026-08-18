// Date => "YYYY-MM-DDThh:mm"
export function dateTimeIntoInputValue(date: Date): string {
  const padStart = (n: number): string => n.toString().padStart(2, '0');
  const YY = date.getFullYear();
  const MM = padStart(date.getMonth() + 1);
  const DD = padStart(date.getDate());
  const hh = padStart(date.getHours());
  const mm = padStart(date.getMinutes());
  return `${YY}-${MM}-${DD}T${hh}:${mm}`;
}

// "YYYY-MM-DDThh:mm" =>  "YYYY-MM-DD hh:mm"
export function inputValueIntoDateTimeApi(value: string): string {
  return value.replace('T', ' ');
}
