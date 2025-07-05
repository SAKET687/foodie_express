import "./Header.css";

const Header = () => {
	return (
		<>
			<div className="header">
				<div className="header-contents">
					<h2>Hungry? Click, Receive and Enjoy.</h2>
					<p>
						Speedy, hassle-free delivery 🍔🚀. Taste the best from
						local favorites 🍕🍜.
					</p>
					<button>
						<a href="#explore-menu">View Menu</a>{" "}
					</button>
				</div>
			</div>
		</>
	);
};

export default Header;
