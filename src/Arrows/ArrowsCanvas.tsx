import React, { Component, ReactNode, RefObject } from "react";
import { Camera, OrthographicCamera, PerspectiveCamera, Renderer, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ArrowsProperties } from "./ArrowsProperties";
import { BaseScene } from "./Three.js/BaseScene";

export interface ArrowsCanvasProperties extends ArrowsProperties {
	scene: BaseScene<any>;
}

export class ArrowsCanvas extends Component<ArrowsCanvasProperties, {}> {
	private static readonly orthographicSize: number = 3.25;

	private canvas: RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();

	private animationFrameRequest: number;
	private renderer: Renderer;
	private camera: Camera;
	private perspectiveCamera: PerspectiveCamera;
	private orthographicCamera: OrthographicCamera;
	private size: DOMRect;
	private perspectiveControls: OrbitControls;
	private orthographicControls: OrbitControls;

	public constructor(props: ArrowsCanvasProperties) {
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
		this.perspectiveControls = this.createControlsFor(this.perspectiveCamera);
		this.orthographicCamera = new OrthographicCamera(
			-ArrowsCanvas.orthographicSize,
			ArrowsCanvas.orthographicSize,
			ArrowsCanvas.orthographicSize,
			-ArrowsCanvas.orthographicSize,
			-1000,
			1000
		);
		this.orthographicCamera.position.setZ(5);
		this.orthographicControls = this.createControlsFor(this.orthographicCamera);
		this.setCamera();

		this.requestAnimationFrame();
	}
	private createControlsFor(camera: Camera): OrbitControls {
		const controls = new OrbitControls(camera, this.renderer.domElement);
		controls.minDistance = 3;
		controls.maxDistance = 100;
		controls.screenSpacePanning = true;
		return controls;
	}

	private updateThreeJs(): void {
		this.perspectiveControls.update();
		this.orthographicControls.update();

		this.updateSize();
		this.renderer.render(this.props.scene, this.camera);

		this.requestAnimationFrame();
	}
	private updateSize(): void {
		const newSize = this.renderer.domElement.getBoundingClientRect();
		if (this.size?.width !== newSize.width || this.size?.height !== newSize.height) {
			this.size = newSize;
			this.perspectiveCamera.aspect = this.size.width / this.size.height;
			this.perspectiveCamera.updateProjectionMatrix();
			this.orthographicCamera.left = -(ArrowsCanvas.orthographicSize * this.size.width / this.size.height);
			this.orthographicCamera.right = ArrowsCanvas.orthographicSize * this.size.width / this.size.height;
			this.orthographicCamera.updateProjectionMatrix();
			this.renderer.setSize(this.size.width, this.size.height);
			this.renderer.domElement.removeAttribute("style");
		}
	}
	private requestAnimationFrame(): void {
		this.animationFrameRequest = window.requestAnimationFrame(this.updateThreeJs.bind(this));
	}

	public componentDidUpdate(prevProps: Readonly<ArrowsCanvasProperties>): void {
		this.props.scene.updateProperties(this.props);

		if (prevProps.cameraMode !== this.props.cameraMode) {
			this.setCamera();
		}
	}

	private setCamera(): void {
		if (this.props.cameraMode === "perspective") {
			this.camera = this.perspectiveCamera;
		}
		else {
			this.camera = this.orthographicCamera;
		}
	}

	public resetView(): void {
		this.perspectiveControls.reset();
		this.orthographicControls.reset();
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