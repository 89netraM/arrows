import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { Torque } from "./Arrows/Scenes/Torque";
import "./styles/index.scss";

ReactDOM.render(
	<React.StrictMode>
		<App
			startingState={{
				isNavOpen: false,
				scene: Torque,
				arrowsProps: Torque.defaultProperties
			}}
		/>
	</React.StrictMode>,
	document.querySelector("app")
);