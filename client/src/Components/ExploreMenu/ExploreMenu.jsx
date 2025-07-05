/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
	return (
		<>
			<div className="explore-menu" id="explore-menu">
				<h1>Explore Our Menu</h1>{" "}
				<p className="explore-menu-text">
					🍽️🚀 Get your favorite local meals delivered fast and fresh.
					With easy ordering, real-time tracking, and personalized
					recommendations, Foodie Express makes dining convenient and
					delicious. 🍔🍕🥗
				</p>
				<div className="explore-menu-list">
					{menu_list.map((item, index) => {
						return (
							<div
								onClick={() =>
									setCategory((prev) =>
										prev === item.menu_name
											? "All"
											: item.menu_name
									)
								}
								key={index}
								className="explore-menu-list-item"
							>
								<img
									className={
										category === item.menu_name
											? "active"
											: " "
									}
									src={item.menu_image}
									alt="icon_menu_list"
								/>
								<p>{item.menu_name}</p>
							</div>
						);
					})}
				</div>
				<hr />
			</div>
		</>
	);
};

export default ExploreMenu;
