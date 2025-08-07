import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Verify.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const Verify = () => {
	const [searchParams] = useSearchParams();
	const success = searchParams.get("success");
	const orderId = searchParams.get("orderId");
	const { url, token } = useContext(StoreContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const verifyPayment = async () => {
		let newUrl = `${url}/api/order/verify`;
		try {
			const response = await axios.post(newUrl, { success, orderId });
			if (response.data.success) {
				navigate(`/orders`);
			} else {
				navigate(`/home`);
			}
		} catch (error) {
			console.error("Error verifying payment:", error);
			navigate(`/home`);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (success && orderId) {
			verifyPayment();
		} else {
			navigate(`/home`);
		}
	}, [success, orderId, navigate, token, url]);

	return (
		<div className="verify">
			{loading ? (
				<>
					<div className="spinner" />
					<span>Hold tight! We’re processing your payment...</span>
				</>
			) : (
				<span>Payment processing complete.</span>
			)}
		</div>
	);
};

export default Verify;
