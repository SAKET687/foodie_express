import { assets } from "../../assets/assets";
import "./Footer.css";

const Footer = () => {
	return (
		<>
			<div className="footer" id="footer">
				<div className="footer-content">
					<div className="footer-content-left">
						<img
							style={{ width: "150px", borderRadius: "10px" }}
							src={assets.footer_logo}
							alt="logo_icon"
						/>
						<p>
							Delivering your favorite meals fast and fresh.
							Explore top local cuisines, track orders in
							real-time, and enjoy exclusive deals.
						</p>
					</div>
					<div className="footer-content-center">
						<h2>Company</h2>
						<ul>
							<a href="/home">
								{" "}
								<li>Home</li>
							</a>
							<a href="/home">
								{" "}
								<li>About Us</li>
							</a>
							<a href="/home">
								<li>Delivery</li>
							</a>
							<a href="/home">
								<li>Privacy Policy</li>
							</a>
						</ul>
					</div>
					<div className="footer-content-right">
						<h2>Get in Touch</h2>
						<ul>
							<li>
								{" "}
								<a href="tel:9876543210">+91 9876543210</a>
							</li>
							<li>
								<a href="mailto:saketsrivastava1245+foodieexpress@gmail.com">
									info@foodieexpress.com
								</a>{" "}
							</li>
						</ul>{" "}
						<div className="footer-social-icons">
							<a
								href="http://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								<img src={assets.facebook_icon} alt="fb" />
							</a>
							<a
								href="http://x.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								<img src={assets.twitter_icon} alt="x" />
							</a>
							<a
								href="http://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={assets.linkedin_icon}
									alt="linkedin"
								/>
							</a>
						</div>
					</div>
				</div>
				<hr />
				<p className="footer-copyright">
					Copyright 2024 &copy; Foodie Express - All Rights Reserved.
				</p>
			</div>
		</>
	);
};

export default Footer;
