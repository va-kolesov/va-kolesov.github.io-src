const EPS = 1e-9;

export interface ICoordinates { x: number, y: number, z: number };
export interface IColor { r: number, g: number, b: number };

/**
 * Point3d - class for a point (or vector) in 3d space
 * contains (x,y,z) coordinates and (r,g,b) color
 */

export default class Point3d {
    private _x: number;
    private _y: number;
    private _z: number;
    private _r: number;
    private _g: number;
    private _b: number;

    public constructor({ x = 0, y = 0, z = 0 }: ICoordinates = { x: 0, y: 0, z: 0 },
                       { r = 0, g = 0, b = 0 }: IColor = { r: 0, g: 0, b: 0 }) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._r = r;
        this._g = g;
        this._b = b;
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public get z() {
        return this._z;
    }

    public get r() {
        return this._r;
    }

    public get g() {
        return this._g;
    }

    public get b() {
        return this._b;
    }

    public abs(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public static dist(a: Point3d, b: Point3d): number {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) +
                         (a.y - b.y) * (a.y - b.y) +
                         (a.z - b.z) * (a.z - b.z));
    }

    public add(other: Point3d): Point3d {
        return new Point3d({ x: this.x + other.x, y: this.y + other.y, z: this.z + other.z }, this.getRGB());
    }

    public sub(other: Point3d): Point3d {
        return new Point3d({ x: this.x - other.x, y: this.y - other.y, z: this.z - other.z }, this.getRGB());
    }

    public dot(other: Point3d): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public static dot(a: Point3d, b: Point3d): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    public normalize(): Point3d {
        try {
            const abs = this.abs();
            if (abs > 0) {
                return this.times(1 / abs);
            } else {
                throw 'Point3d::normalize() - ERROR: trying to normalize zero-length vector';
            }
        } catch (error) {
            console.error(error);
            return new Point3d();
        }
    }

    public static mul(a: Point3d, b: Point3d): Point3d {
        return new Point3d({ x: a.y * b.z - a.z * b.y, y: a.x * b.z - a.z * b.x, z: a.x * b.y - a.y * b.x });
    }

    public times(k: number): Point3d {
        return new Point3d({ x: this.x * k, y: this.y * k, z: this.z * k }, this.getRGB());
    }

    public rotateX(a: number): Point3d {
        return new Point3d({
            x: this.x,
            y: Math.cos(a) * this.y - Math.sin(a) * this.z,
            z: Math.sin(a) * this.y + Math.cos(a) * this.z
        });
    }
    public rotateY(a: number): Point3d {
        return new Point3d({
            x: Math.cos(a) * this.x - Math.sin(a) * this.z,
            y: this.y,
            z: Math.sin(a) * this.x + Math.cos(a) * this.z
        });
    }
    public rotateZ(a: number): Point3d {
        return new Point3d({
            x: Math.cos(a) * this.x - Math.sin(a) * this.y,
            y: Math.sin(a) * this.x + Math.cos(a) * this.y,
            z: this.z
        });
    }

    // Rodrigues rotation formula
    public rotate(axis: Point3d, a: number): Point3d {

        try {
            const w = axis.normalize(); 
            return new Point3d({
                x: (Math.cos(a) + w.x * w.x * (1 - Math.cos(a))) * this.x + (w.x * w.y * (1 - Math.cos(a)) - w.z * Math.sin(a)) * this.y + (w.y * Math.sin(a) + w.x * w.z * (1 - Math.cos(a))) * this.z,
                y: (w.z * Math.sin(a) + w.x * w.y * (1 - Math.cos(a))) * this.x + (Math.cos(a) + w.y * w.y * (1 - Math.cos(a))) * this.y + (-w.x * Math.sin(a) + w.y * w.z * (1 - Math.cos(a))) * this.z,
                z: (-w.y * Math.sin(a) + w.x * w.z * (1 - Math.cos(a))) * this.x + (w.x * Math.sin(a) + w.y * w.z * (1 - Math.cos(a))) * this.y + (Math.cos(a) + w.z * w.z * (1 - Math.cos(a))) * this.z
            });
        } catch (error) {
            console.error(error + "\nPoint3d::rotate() - ERROR: trying to rotate around zero-length vector");
            return new Point3d();
        }
        
       
    }

    public toString(): string {
        return '(' + this.x + ' ' + this.y + ' ' + this.z + ')';
    }

    public getXYZ(): ICoordinates {
        return { x: this.x, y: this.y, z: this.z };
    }

    public getRGB(): IColor {
        return { r: this.r, g: this.g, b: this.b };
    }

    public toPlyString(): string {
        return this.x + ' ' + this.y + ' ' + this.z + ' ' + this.r + ' ' + this.g + ' ' + this.b;
    }
    
    public static isEqual(a: Point3d, b: Point3d): boolean {
        return Math.abs(a.x - b.x) < EPS && Math.abs(a.x - b.y) < EPS && Math.abs(a.z - b.z) < EPS;
    }
}