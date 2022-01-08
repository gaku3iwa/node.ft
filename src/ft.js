// ----------------------------------------------------------------------------
// ft.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
// ----------------------------------------------------------------------------
import { util } from "./util.js";

// ----------------------------------------------------------------------------
// 離散フーリエ 畳み込み演算
const dftc = (c, T) => {
  return [...Array(c.length).keys()].map((i) => util.isum(c.map((cn, n) => util.imul(cn, util.expi(T * n * i)))));
};

// ----------------------------------------------------------------------------
// 離散フーリエ ２の冪乗のデータ数
const revBit = (k, n0) => {
  if (k === 1) return n0;
  const s1 = ((n0 & 0xaaaaaaaa) >>> 1) | ((n0 & 0x55555555) << 1);
  if (k === 2) return s1;
  const s2 = ((s1 & 0xcccccccc) >>> 2) | ((s1 & 0x33333333) << 2);
  if (k <= 4) return s2 >>> (4 - k);
  const s3 = ((s2 & 0xf0f0f0f0) >>> 4) | ((s2 & 0x0f0f0f0f) << 4);
  if (k <= 8) return s3 >>> (8 - k);
  const s4 = ((s3 & 0xff00ff00) >>> 8) | ((s3 & 0x00ff00ff) << 8);
  if (k <= 16) return s4 >>> (16 - k);
  const s5 = ((s4 & 0xffff0000) >>> 16) | ((s4 & 0x0000ffff) << 16);
  return s5 >>> (32 - k);
};

const fftin1 = (c, T, N) => {
  const k = Math.log2(N);
  const rec = c.map((_, i) => c[revBit(k, i)]);
  for (let Nh = 1; Nh < N; Nh *= 2) {
    T /= 2;
    for (let s = 0; s < N; s += Nh * 2) {
      for (let i = 0; i < Nh; i++) {
        const l = rec[s + i];
        const re = util.imul(rec[s + i + Nh], util.expi(T * i));
        [rec[s + i], rec[s + i + Nh]] = [util.iadd(l, re), util.isub(l, re)];
      }
    }
  }
  return rec;
};

const fft1 = (f) => {
  const N = f.length;
  const T = -2 * Math.PI;
  return fftin1(f, T, N);
};

const ifft1 = (F) => {
  const N = F.length;
  const T = 2 * Math.PI;
  return fftin1(F, T, N).map(([r, i]) => [r / N, i / N]);
};

// ----------------------------------------------------------------------------
// 離散フーリエ 任意のデータ数
const conj = ([x, y]) => {
  return [x, -y];
};

const fftin2 = (c, T, N) => {
  const Nd = N * 2;
  const bc = c.map((_, n) => util.expi((T * n * n) / Nd));
  const b = bc.map(conj);
  const a = c.map((cn, n) => util.imul(cn, bc[n]));

  const N2 = 1 << (32 - Math.clz32(Nd - 1));
  const a2 = a.concat(Array(N2 - N).fill([0, 0]));
  const b2 = b.concat(Array(N2 - Nd + 1).fill([0, 0]), b.slice(1).reverse());
  const A2 = fft1(a2);
  const B2 = fft1(b2);
  const AB2 = A2.map((A2n, n) => util.imul(A2n, B2[n]));
  const ab2 = ifft1(AB2);
  return bc.map((bcn, n) => util.imul(bcn, ab2[n]));
};

const fft2 = (f) => {
  const N = f.length;
  const T = -2 * Math.PI;
  return fftin2(f, T, N);
};

const ifft2 = (F) => {
  const N = F.length;
  const T = 2 * Math.PI;
  return fftin2(F, T, N).map(([x, y]) => [x / N, y / N]);
};

const isPowerOf2 = (n) => (n & (n - 1)) === 0;

// ----------------------------------------------------------------------------
// 離散フーリエ変換
class fft {
  // --------------------------------------------------------------------------
  // 変換
  static convert = (f) => {
    const N = f.length,
      T = -2 * Math.PI;
    const fftin = isPowerOf2(N) ? fftin1 : fftin2;
    return fftin(f, T, N);
  };

  // --------------------------------------------------------------------------
  // 逆変換
  static revert = (F) => {
    const N = F.length,
      T = 2 * Math.PI;
    const fftin = isPowerOf2(N) ? fftin1 : fftin2;
    return fftin(F, T, N).map(([x, y]) => [x / N, y / N]);
  };
}

// ----------------------------------------------------------------------------
// 離散フーリエ変換
class dft {
  // --------------------------------------------------------------------------
  // 変換
  static convert = (f) => {
    const N = f.length;
    const T = (-2 * Math.PI) / N;
    return dftc(f, T);
  };

  // --------------------------------------------------------------------------
  // 逆変換
  static revert = (F) => {
    const N = F.length;
    const T = (2 * Math.PI) / N;
    return dftc(F, T).map(([r, i]) => [r / N, i / N]);
  };
}

// ----------------------------------------------------------------------------
// 外部公開インターフェース
export { fft, dft };
