function generateRandomNumber() {
  //Random number from 100000 to 999999
  return Math.floor(Math.random() * 888888) + 111111;
}

function generateRandomLetters() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomLetters = '';

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomLetters += letters[randomIndex];
  }

  return randomLetters;
}

export function generateIdNumber() {
  return `${generateRandomNumber()}${generateRandomLetters()}`;
}
