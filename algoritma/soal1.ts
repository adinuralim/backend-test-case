const str = "NEGIE1";

const match = RegExp(/([a-zA-Z]+)(\d+)?/).exec(str);

if (match) {
  console.log(`${match[1].split("").reverse().join("")}${match[2]}`);
}
