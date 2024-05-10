const sentence = "Saya sangat senang mengerjakan soal algoritma";

let tokenLength = 0;
let tempToken = "";
for (const token of sentence.split(" ")) {
  if (tokenLength < token.length) {
    tokenLength = token.length;
    tempToken = token;
  }
}

console.log(`${tempToken} : ${tokenLength}`);
