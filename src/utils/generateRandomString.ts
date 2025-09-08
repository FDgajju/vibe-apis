export type RandomStringParam = {
  numbers?: boolean;
  specialChar?: boolean;
  alphabets?: boolean;
};

export const generateRandomString = (
  length: number,
  params: RandomStringParam = {},
): string => {
  const charSets = {
    numbers: '0123456789',
    specialChar: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    alphabets: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  };

  // If no params are provided, include all character sets
  if (Object.keys(params).length === 0) {
    params = { numbers: true, specialChar: true, alphabets: true };
  }

  // Build the character set based on the provided params
  let activeSet = '';
  if (params.numbers) activeSet += charSets.numbers;
  if (params.specialChar) activeSet += charSets.specialChar;
  if (params.alphabets) activeSet += charSets.alphabets;

  // Generate the random string from the active character set
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * activeSet.length);
    randomString += activeSet.charAt(randomIndex);
  }

  return randomString;
};
