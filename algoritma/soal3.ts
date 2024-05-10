const input = ["xc", "dz", "bbb", "dz"];
const query = ["bbb", "ac", "dz"];

const results: number[] = [];

for (const q of query) {
  results.push(input.filter((x) => x == q).length);
}

console.log(results);
