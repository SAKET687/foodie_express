import { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
	const { url, cartItems, addToCart, removeFromCart } =
		useContext(StoreContext);

	const quantity = cartItems[id] || 0;

	console.log("Rendering FoodItem for ID:", id, "Quantity:", quantity);

	return (
		<div className="food-item">
			<div className="food-item-image-container">
				<img
					src={`${url}/images/${image}`}
					alt="food-item"
					className="food-item-image"
				/>
				{quantity === 0 ? (
					<img
						className="add"
						onClick={() => addToCart(id)}
						src={assets.add_icon_white}
						alt="add"
					/>
				) : (
					<div className="food-item-counter">
						<img
							onClick={() => removeFromCart(id)}
							src={assets.remove_icon_red}
							alt="remove"
						/>
						<p>{quantity}</p>
						<img
							onClick={() => addToCart(id)}
							src={assets.add_icon_green}
							alt="green"
							className="add-quant"
						/>
					</div>
				)}
			</div>
			<div className="food-item-info">
				<div className="food-item-name-rating">
					<p>{name}</p>
					<img src={assets.rating_starts} alt="rating" />
				</div>
				<p className="food-item-description">{description}</p>
				<p className="food-item-price">₹{price}</p>
			</div>
		</div>
	);
};

export default FoodItem;
