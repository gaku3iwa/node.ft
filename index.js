const myLib = require("./docs/ft_bundle.js");

console.log("***** dft demo *****");
{
  // 15 elements example
  const fr0 = [1.5, 3.4, 4.2, 2.0, 5.0, 6.0, 2.5, 4.4, 0.2, 1.0, 3.0, 4.0, 5.5, 62.4, 2.2];
  const f0 = fr0.map((r) => [r, 0]);
  const F = myLib.dft.convert(f0);
  const f1 = myLib.dft.revert(F);
  const fr1 = f1.map(([r]) => r);

  console.log("fr0:", fr0);
  console.log("F:", F);
  // console.log("f1:", f1);
  console.log(
    "fr1:",
    fr1.map((r) => myLib.util.round(r, 3))
  );
}

console.log("***** fft demo *****");
{
  // 15 elements example
  const fr0 = [1.5, 3.4, 4.2, 2.0, 5.0, 6.0, 2.5, 4.4, 0.2, 1.0, 3.0, 4.0, 5.5, 62.4, 2.2];
  const f0 = fr0.map((r) => [r, 0]);
  const F = myLib.fft.convert(f0);
  const f1 = myLib.fft.revert(F);
  const fr1 = f1.map(([r]) => r);

  console.log("fr0:", fr0);
  console.log("F:", F);
  // console.log("f1:", f1);
  console.log(
    "fr1:",
    fr1.map((r) => myLib.util.round(r, 3))
  );
}
