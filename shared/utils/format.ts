export const formatNIF = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Format as XXX XXX XXX
  const parts = [];
  for (let i = 0; i < digits.length && i < 9; i += 3) {
    parts.push(digits.slice(i, i + 3));
  }

  return parts.join(" ");
};

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Format as XXX XXX XXX
  const parts = [];
  for (let i = 0; i < digits.length && i < 9; i += 3) {
    parts.push(digits.slice(i, i + 3));
  }

  return parts.join(" ");
};

export const unformatNumber = (value: string): string => {
  // Remove all non-digit characters
  return value.replace(/\D/g, "");
};
