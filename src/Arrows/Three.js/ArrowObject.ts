import { Object3D, ConeGeometry, Material, Mesh, MeshBasicMaterial, CylinderGeometry } from "three";
import { SpriteText2D, textAlign } from "three-text2d";
import { ILabeled } from "./ILabeled";

export class ArrowObject extends Object3D implements ILabeled {
	private static readonly fontSize: number = 80;
	private static readonly labelScale: number = 0.3 / ArrowObject.fontSize;
	private static getFont(): string {
		return window.getComputedStyle(document.body)
			.getPropertyValue("font")
			.replace(/\d+px/, ArrowObject.fontSize + "px");
	}
	private static getFontColor(): string {
		return window.getComputedStyle(document.body)
			.getPropertyValue("--color");
	}

	//#region Static helpers
	private static calcDirection(totalLength: number): number {
		if (totalLength >= 0.0) {
			return 1.0;
		}
		else {
			return -1.0;
		}
	}

	public static readonly headRadius: number = 0.15;
	public static readonly headLength: number = 0.3;
	private static calcHeadPosition(totalLength: number): number {
		return (Math.abs(totalLength) - ArrowObject.headLength / 2.0) * ArrowObject.calcDirection(totalLength);
	}

	public static readonly arrowRadius: number = 0.05;
	private static calcArrowLength(totalLength: number): number {
		return (Math.abs(totalLength) - ArrowObject.headLength) * ArrowObject.calcDirection(totalLength);
	}
	private static calcArrowPosition(totalLength: number): number {
		return ArrowObject.calcArrowLength(totalLength) / 2.0;
	}
	//#endregion Static helpers

	private readonly headMesh: Mesh;
	public get headMaterial(): Material | Array<Material> {
		return this.headMesh.material;
	}
	public set headMaterial(value: Material | Array<Material>) {
		this.headMesh.material = value;
	}

	private readonly arrowMesh: Mesh;
	public get arrowMaterial(): Material | Array<Material> {
		return this.arrowMesh.material;
	}
	public set arrowMaterial(value: Material | Array<Material>) {
		this.arrowMesh.material = value;
	}

	private _length: number;
	public get length(): number {
		return this._length;
	}
	public set length(value: number) {
		this._length = value;
		this.updateLength();
	}

	private labelSprite: SpriteText2D = null;
	private _label: string = "";
	public get label(): string {
		return this._label;
	}
	public set label(value: string) {
		this._label = value;

		if (this.labelSprite != null) {
			this.remove(this.labelSprite);
			this.labelSprite = null;
		}

		if (this.label != null && this.label !== "") {
			this.labelSprite = new SpriteText2D(
				this.label,
				{
					align: textAlign.topLeft,
					font: ArrowObject.getFont(),
					fillStyle: ArrowObject.getFontColor(),
					antialias: true,
				}
			);
			this.labelSprite.material.depthTest = false;
			this.labelSprite.scale.set(ArrowObject.labelScale, ArrowObject.labelScale, ArrowObject.labelScale);
			this.labelSprite.visible = this.isLabelVisible;
			this.updateLabelPosition();
			this.add(this.labelSprite);
		}
	}
	private _labelVisible: boolean = true;
	public get isLabelVisible(): boolean {
		return this._labelVisible;
	}
	public set isLabelVisible(value: boolean) {
		if (this._labelVisible !== value) {
			this._labelVisible = value;

			if (this.labelSprite != null) {
				this.labelSprite.visible = value;
			}
		}
	}

	public constructor(headMaterial?: Material, arrowMaterial?: Material, radius: number = 1.0, length: number = 1.0, detail: number = 25) {
		super();

		const headGeometry = new ConeGeometry(ArrowObject.headRadius * radius, ArrowObject.headLength * radius, detail);
		if (headMaterial != null) {
			this.headMesh = new Mesh(headGeometry, headMaterial);
		}
		else {
			this.headMesh = new Mesh(headGeometry, new MeshBasicMaterial({ color: 0x333333 }));
		}
		this.add(this.headMesh);

		const arrowGeometry = new CylinderGeometry(ArrowObject.arrowRadius * radius, ArrowObject.arrowRadius * radius, 1.0, detail);
		if (arrowMaterial != null) {
			this.arrowMesh = new Mesh(arrowGeometry, arrowMaterial);
		}
		else {
			this.arrowMesh = new Mesh(arrowGeometry, new MeshBasicMaterial({ color: 0x333333 }));
		}
		this.add(this.arrowMesh);

		this.length = length;
	}

	private updateLength(): void {
		if (Math.abs(this.length) < ArrowObject.headLength) {
			this.arrowMesh.visible = this.headMesh.visible = false;
		}
		else {
			this.arrowMesh.visible = this.headMesh.visible = true;
		}

		this.headMesh.scale.y = ArrowObject.calcDirection(this.length);
		this.headMesh.position.y = ArrowObject.calcHeadPosition(this.length);
		this.arrowMesh.scale.y = ArrowObject.calcArrowLength(this.length);
		this.arrowMesh.position.y = ArrowObject.calcArrowPosition(this.length);
		this.updateLabelPosition();
	}

	private updateLabelPosition(): void {
		if (this.labelSprite != null) {
			this.labelSprite.position.y = this.headMesh.position.y + ArrowObject.headLength / 2;
		}
	}
}