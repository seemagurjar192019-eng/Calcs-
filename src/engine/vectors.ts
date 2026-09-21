/**
 * Vector and 2D/3D Geometry Engine
 */

import { cleanFloat } from './precision';

export type Vector = [number, number, number];

export class VectorEngine {
  static add(u: Vector, v: Vector): Vector {
    return [cleanFloat(u[0] + v[0]), cleanFloat(u[1] + v[1]), cleanFloat(u[2] + v[2])];
  }

  static subtract(u: Vector, v: Vector): Vector {
    return [cleanFloat(u[0] - v[0]), cleanFloat(u[1] - v[1]), cleanFloat(u[2] - v[2])];
  }

  static scale(v: Vector, s: number): Vector {
    return [cleanFloat(v[0] * s), cleanFloat(v[1] * s), cleanFloat(v[2] * s)];
  }

  static dot(u: Vector, v: Vector): number {
    return cleanFloat(u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
  }

  static cross(u: Vector, v: Vector): Vector {
    return [
      cleanFloat(u[1] * v[2] - u[2] * v[1]),
      cleanFloat(u[2] * v[0] - u[0] * v[2]),
      cleanFloat(u[0] * v[1] - u[1] * v[0]),
    ];
  }

  static magnitude(v: Vector): number {
    return cleanFloat(Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]));
  }

  static normalize(v: Vector): Vector {
    const mag = this.magnitude(v);
    if (mag === 0) return [0, 0, 0];
    return [cleanFloat(v[0] / mag), cleanFloat(v[1] / mag), cleanFloat(v[2] / mag)];
  }

  static distance(u: Vector, v: Vector): number {
    return this.magnitude(this.subtract(u, v));
  }

  static angle(u: Vector, v: Vector, inDegrees: boolean = true): number {
    const magU = this.magnitude(u);
    const magV = this.magnitude(v);
    if (magU === 0 || magV === 0) return 0;
    const cosTheta = Math.max(-1, Math.min(1, this.dot(u, v) / (magU * magV)));
    const rad = Math.acos(cosTheta);
    return inDegrees ? cleanFloat((rad * 180) / Math.PI) : cleanFloat(rad);
  }

  static projection(u: Vector, ontoV: Vector): Vector {
    const magV2 = this.dot(ontoV, ontoV);
    if (magV2 === 0) return [0, 0, 0];
    const scalar = this.dot(u, ontoV) / magV2;
    return this.scale(ontoV, scalar);
  }
}
