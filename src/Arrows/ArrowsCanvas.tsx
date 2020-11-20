import React, { Component, ReactNode, RefObject } from "react";
import { Mesh, MeshToonMaterial, PerspectiveCamera, Renderer, SphereGeometry, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ArrowsProperties } from "./ArrowsProperties";
import { ArrowObject } from "./Three.js/ArrowObject";
import { BaseScene } from "./Three.js/BaseScene";
import { TorqueObject } from "./Three.js/TorqueObject";
import { VectorObject } from "./Three.js/VectorObject";

export class ArrowsCanvas extends Component<ArrowsProperties, {}> {
	private canvas: RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();

	private animationFrameRequest: number;
	private renderer: Renderer;
	private perspectiveCamera: PerspectiveCamera;
	private size: DOMRect;
	private controls: OrbitControls;
	private scene: BaseScene;

	public constructor(props: ArrowsProperties) {
		super(props);
	}

	public componentDidMount(): void {
		this.renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
			powerPreference: "low-power",
			canvas: this.canvas.current,
		});

		this.perspectiveCamera = new PerspectiveCamera(75, 1, 0.1, 1000);
		this.perspectiveCamera.position.setZ(5);

		this.controls = new OrbitControls(this.perspectiveCamera, this.renderer.domElement);
		this.controls.minDistance = 3;
		this.controls.maxDistance = 100;
		this.controls.screenSpacePanning = true;

		this.scene = new (class extends BaseScene {
			public constructor() {
				super();

				const x = new ArrowObject(VectorObject.xHeadMaterial, VectorObject.xHeadMaterial, 1.05);
				x.rotateX(Math.PI / 2);
				this.add(x);

				const y = new ArrowObject(VectorObject.yHeadMaterial, VectorObject.yHeadMaterial, 1.05);
				y.rotateZ(-Math.PI / 2);
				this.add(y);

				const z = new ArrowObject(VectorObject.zHeadMaterial, VectorObject.zHeadMaterial, 1.05);
				this.add(z);

				const r = new VectorObject(new Vector3(2, 3, -1.5), VectorObject.baseMaterial);
				this.add(r);

				const F = new VectorObject(new Vector3(-1, -4, 2.5), new MeshToonMaterial({ color: 0x8F45C7 }));
				F.position.set(r.x, r.y, r.z);
				this.add(F);

				const M = new TorqueObject(new Vector3(0.0, 0.0, 0.0), new MeshToonMaterial({ color: 0xFFD966 }));
				M.position.set(r.position.x, r.position.y, r.position.z);
				M.x = r.y * F.z - r.z * F.y;
				M.y = r.z * F.x - r.x * F.z;
				M.z = r.x * F.y - r.y * F.x;
				this.add(M);
			}
		})();
		if (this.props.isOn) {
			this.scene.showGrid();
		}

		this.requestAnimationFrame();
	}

	private updateThreeJs(): void {
		this.controls.update();

		this.updateSize();
		this.renderer.render(this.scene, this.perspectiveCamera);

		this.requestAnimationFrame();
	}
	private updateSize(): void {
		const newSize = this.renderer.domElement.getBoundingClientRect();
		if (this.size?.width !== newSize.width || this.size?.height !== newSize.height) {
			this.size = newSize;
			this.perspectiveCamera.aspect = this.size.width / this.size.height;
			this.perspectiveCamera.updateProjectionMatrix();
			this.renderer.setSize(this.size.width, this.size.height);
			this.renderer.domElement.removeAttribute("style");
		}
	}
	private requestAnimationFrame(): void {
		this.animationFrameRequest = window.requestAnimationFrame(this.updateThreeJs.bind(this));
	}

	public componentDidUpdate(prevProps: Readonly<ArrowsProperties>): void {
		if (prevProps.isOn !== this.props.isOn) {
			if (this.props.isOn) {
				this.scene.showGrid();
			}
			else {
				this.scene.hideGrid();
			}
		}
	}

	public componentWillUnmount(): void {
		if (this.animationFrameRequest != null) {
			window.cancelAnimationFrame(this.animationFrameRequest);
		}
	}

	public render(): ReactNode {
		return (
			<canvas ref={this.canvas}></canvas>
		);
	}
}