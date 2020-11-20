import React, { Component, ReactNode, RefObject } from "react";
import { PerspectiveCamera, Renderer, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ArrowsProperties } from "./ArrowsProperties";
import { MainScene } from "./Three.js/MainScene";

export class ArrowsCanvas extends Component<ArrowsProperties, {}> {
	private canvas: RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();

	private animationFrameRequest: number;
	private renderer: Renderer;
	private perspectiveCamera: PerspectiveCamera;
	private size: DOMRect;
	private controls: OrbitControls;
	private scene: MainScene;

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

		this.controls = new OrbitControls(this.perspectiveCamera, this.renderer.domElement);
		this.controls.minDistance = 3;
		this.controls.maxDistance = 100;
		this.controls.screenSpacePanning = true;

		this.scene = new MainScene();
		if (this.props.isOn) {
			this.scene.showBall();
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
				this.scene.showBall();
			}
			else {
				this.scene.hideBall();
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