import { Vector3, Material, Line, BufferGeometry, LineDashedMaterial, Geometry, LineBasicMaterial } from "three";
import { cssColorToThreeJSColor, getThemedColor } from "./themed";
import { VectorObject } from "./VectorObject";

export class VectorObjectWithLever extends VectorObject {
	public static readonly paddingDistance: number = 0.3;
	public static readonly angleDistance: number = 0.15;
	public static readonly leverColor: number = 0xff0000;

	protected readonly targetPoint: Vector3;
	protected readonly lineMesh: Line;
	protected readonly leverMesh: Line;
	protected readonly angleMesh: Line

	public constructor(targetPoint: Vector3, vector: Vector3, baseMaterial?: Material, label?: string);
	public constructor(targetPoint: Vector3, x: number, y: number, z: number, baseMaterial?: Material, label?: string);
	public constructor(targetPoint: Vector3, a: Vector3 | number, b?: number | Material, c?: number | string, d?: Material, e?: string) {
		super(a, b, c, d, e);

		this.targetPoint = targetPoint;

		this.lineMesh = new Line(
			new Geometry(),
			new LineDashedMaterial({
				color: cssColorToThreeJSColor(getThemedColor()),
				dashSize: 0.1,
				gapSize: 0.05,
			})
		);
		this.add(this.lineMesh);

		this.leverMesh = new Line(
			new Geometry(),
			new LineBasicMaterial({
				color: VectorObjectWithLever.leverColor,
			})
		);
		this.add(this.leverMesh);

		this.angleMesh = new Line(
			new Geometry(),
			new LineBasicMaterial({
				color: VectorObjectWithLever.leverColor,
			})
		);
		this.add(this.angleMesh);

		this.addEventListener("added", this.onAdded);
	}

	private onAdded(): void {
		this.updateGeometry();
		this.removeEventListener("added", this.onAdded);
	}

	public setPosition(x: number, y: number, z: number): void {
		this.position.set(x, y, z);
		this.updateGeometry();
	}

	private calculateGeometry(): [BufferGeometry, BufferGeometry, BufferGeometry] {
		// Borrowed from https://forum.unity.com/threads/how-do-i-find-the-closest-point-on-a-line.340058/#post-2198950
		const dir = this.vector.clone().normalize();
		const localTargetPoint = this.targetPoint.clone().sub(this.position);
		const distance = localTargetPoint.dot(dir);
		const localClosestPoint = dir.multiplyScalar(distance);

		return [
			new BufferGeometry().setFromPoints(new Array<Vector3>(
				localClosestPoint.clone().normalize().setLength(-VectorObjectWithLever.paddingDistance),
				localClosestPoint.clone().setLength(localClosestPoint.length() + VectorObjectWithLever.paddingDistance)
			)),
			new BufferGeometry().setFromPoints(new Array<Vector3>(
				localClosestPoint.clone(),
				localTargetPoint.clone()
			)),
			new BufferGeometry().setFromPoints(new Array<Vector3>(
				localClosestPoint.clone().add(localTargetPoint.clone().sub(localClosestPoint).setLength(VectorObjectWithLever.angleDistance)),
				localClosestPoint.clone().setLength(localClosestPoint.length() + VectorObjectWithLever.angleDistance).add(localTargetPoint.clone().sub(localClosestPoint).setLength(VectorObjectWithLever.angleDistance)),
				localClosestPoint.clone().setLength(localClosestPoint.length() + VectorObjectWithLever.angleDistance)
			)),
		];
	}

	protected updateVectors(): void {
		super.updateVectors();
		this.updateGeometry();
	}

	protected updateGeometry(): void {
		if (this.lineMesh != null) {
			[
				this.lineMesh.geometry,
				this.leverMesh.geometry,
				this.angleMesh.geometry,
			] = this.calculateGeometry();
			this.lineMesh.computeLineDistances();
			this.leverMesh.computeLineDistances();
			this.angleMesh.computeLineDistances();
		}
	}
}