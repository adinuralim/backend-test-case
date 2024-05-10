const matrix = [
  [1, 2, 0, 4],
  [4, 5, 6, 2],
  [7, 8, 9, 4],
  [7, 8, 9, 3],
];

let min = 0;
let max = matrix.length - 1;
let diagonal1 = 0;
let diagonal2 = 0;
for (let i = 0; i < matrix.length; i++) {
  diagonal1 += matrix[min][i];
  diagonal2 += matrix[max][i];
  min++;
  max--;
}

const result = diagonal1 - diagonal2;
console.log(result);
