/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
	const { url, setToken } = useContext(StoreContext);
	const [currentState, setCurrentState] = useState("Login");
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const onChangeHandler = (event) => {
		const id = event.target.id;
		const value = event.target.value;
		setData((data) => ({
			...data,
			[id]: value,
		}));
	};

	// to check the input data on console
	// useEffect(() => {
	// 	console.log(data);
	// }, [data]);

	const onLogin = async (event) => {
		event.preventDefault();
		let newUrl = url;
		if (currentState === "Login") {
			newUrl += "/api/user/login";
			// console.log(newUrl);
		} else {
			newUrl += "/api/user/register";
			// console.log(newUrl);
		}

		const response = await axios.post(newUrl, data);
		if (response.data.success) {
			{
				currentState === "Login"
					? toast.success(response.data.message)
					: toast.success("User Account Created Successfully.");
			}
			const new_token = response.data.token;
			setToken(new_token);
			localStorage.setItem("token", new_token);
			setShowLogin(false);
		} else {
			toast.error(response.data.message);
		}
	};

	return (
		<>
			<div className="login-popup">
				<form className="login-popup-container" onSubmit={onLogin}>
					<div className="login-popup-title">
						<h2>{currentState}</h2>
						<img
							onClick={() => setShowLogin(false)}
							src={assets.cross_icon}
							alt="x"
						/>
					</div>
					<div className="login-popup-inputs">
						{currentState === "SignUp" ? (
							<input
								type="text"
								id="name"
								value={data.id}
								onChange={onChangeHandler}
								placeholder="Enter your name"
								required
							/>
						) : (
							<></>
						)}
						<input
							type="email"
							id="email"
							value={data.id}
							onChange={onChangeHandler}
							placeholder="Enter your email"
							required
						/>
						<input
							type="password"
							id="password"
							value={data.id}
							onChange={onChangeHandler}
							placeholder="Enter your password"
							required
						/>
					</div>
					<div className="login-popup-condition">
						<input type="checkbox" required />
						<p>
							By continuing, I agree to the Terms of Uses and
							Privacy Policy.
						</p>
					</div>
					<button type="submit">
						{currentState === "SignUp" ? "Create Account" : "Login"}
					</button>
					{currentState === "SignUp" ? (
						<p>
							Already have an account?
							<span onClick={() => setCurrentState("Login")}>
								Login here
							</span>{" "}
						</p>
					) : (
						<p>
							Don't have an account?{" "}
							<span onClick={() => setCurrentState("SignUp")}>
								Click here
							</span>
						</p>
					)}{" "}
				</form>
			</div>
		</>
	);
};

export default LoginPopup;
