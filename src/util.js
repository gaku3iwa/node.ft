// ----------------------------------------------------------------------------
// myMath.js
// Copyright © 2021- gaku.iwa All Rights Reserved.
//-----------------------------------------------------------------------------
export class util {
  static expi = (theta) => {
    return [Math.cos(theta), Math.sin(theta)];
  };

  static iadd = ([ax, ay], [bx, by]) => {
    return [ax + bx, ay + by];
  };

  static isub = ([ax, ay], [bx, by]) => {
    return [ax - bx, ay - by];
  };

  static imul = ([ax, ay], [bx, by]) => {
    return [ax * bx - ay * by, ax * by + ay * bx];
  };

  static isum = (cs) => {
    return cs.reduce((s, c) => this.iadd(s, c), [0, 0]);
  };

  static round = (num, digit) => {
    var digitVal = Math.pow(10, digit);
    var retVal;
    if (digitVal < 1) {
      retVal = Math.round(num * digitVal) * Math.pow(10, -1 * digit);
    } else {
      retVal = Math.round(num * digitVal) / digitVal;
    }
    return retVal;
  };
}
