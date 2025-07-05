/* eslint-disable no-unused-vars */
import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";

const AppDownload = () => {
	return (
		<>
			<div className="app-download" id="app-download">
				<p>
					For Better Experience Download <br />
					<strong>Foodie Express App</strong>
				</p>
				<div className="app-download-platforms">
					<img src={assets.play_store} alt="play-store-img" />
					<img src={assets.app_store} alt="app-store-img" />
				</div>
			</div>
		</>
	);
};

export default AppDownload;
