import { useState, useEffect, useContext } from "react";
import "./Search.css";
import axios from "axios";
import FoodItem from "../../Components/FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const Search = () => {
	const { url } = useContext(StoreContext);
	const placeholders = [
		"Enter dishes name, like pasta, pizza, etc.",
		"Discover new flavors today!",
		"Feeling hungry? Find your meal.",
		"Search your favorite cuisine...",
		"What's for dinner tonight?",
		"Find the perfect dessert...",
		"Craving something special?",
		"Type a dish name or ingredient...",
		"Explore popular recipes now!",
		"Spice up your meal planning...",
		"Feeling adventurous? Try a new dish.",
		"Discover vegetarian delights...",
		"What’s cooking? Enter a dish...",
		"Elevate your meal with new recipes...",
		"Find quick and easy meals...",
	];
	const [placeholder, setPlaceholder] = useState(placeholders[0]);
	const [index, setIndex] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [foodList, setFoodList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prevIndex) => {
				const newIndex = (prevIndex + 1) % placeholders.length;
				setPlaceholder(placeholders[newIndex]);
				return newIndex;
			});
		}, 2500);
		return () => clearInterval(interval);
	}, []);

	const handleSearchInputChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		if (value.length >= 3) {
			fetchFoodList(value);
		} else {
			setFoodList([]);
		}
	};

	const fetchFoodList = async (query) => {
		try {
			setLoading(true);
			setError("");
			const response = await axios.post(`${url}/api/food/search`, {
				searchTerm: query,
			});
			if (response.data.success) {
				setFoodList(response.data.data);
			} else {
				setError(response.data.message || "No food items found.");
			}
		} catch (error) {
			console.error("Error fetching food list:", error);
			setError("Error fetching food items. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="search">
				<div className="input-search">
					<input
						type="text"
						name="search-input"
						id="search-input"
						placeholder={placeholder}
						value={searchTerm}
						onChange={handleSearchInputChange}
					/>
				</div>
				<div className="search-results">
					{loading && <div className="loading">Loading...</div>}
					{error && <div className="error-message">{error}</div>}
					<div className="food-display-list">
						{foodList.map((item, index) => (
							<FoodItem
								key={index}
								id={item._id}
								name={item.name}
								price={item.price}
								description={item.description}
								image={item.image}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default Search;
