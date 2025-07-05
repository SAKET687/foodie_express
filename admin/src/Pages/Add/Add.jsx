/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import "./Add.css";
import { toast } from "react-toastify";

const Add = ({ url }) => {
	const [image, setImage] = useState(false);
	const [data, setData] = useState({
		name: "",
		description: "",
		category: "Salad",
		price: "",
	});

	const onChangeHandler = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setData((data) => ({ ...data, [name]: value }));
	};

	// to show the input data
	// useEffect(() => {
	// 	console.log(data);
	// 	console.log(image);
	// }, [data, image]);

	const onSubmitHandler = async (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("description", data.description);
		formData.append("category", data.category);
		formData.append("price", Number(data.price));
		formData.append("image", image);
		const response = await axios.post(`${url}/api/food/add`, formData);
		if (response.data.success) {
			setData({
				name: "",
				description: "",
				category: "Salad",
				price: "",
			});
			setImage(false);
			toast.success(response.data.message);
			response.json({ message: "Food Added" });
		} else {
			toast.error(response.data.message);
			response.json({ message: "Food not Added" });
		}
	};

	return (
		<>
			<div className="add">
				<form className="flex-col" onSubmit={onSubmitHandler}>
					<div className="add-image-upload flex-col">
						<p>Upload Image</p>
						<label htmlFor="image">
							<img
								src={
									image === false
										? assets.upload_area
										: URL.createObjectURL(image)
								}
								alt={image === false ? "upload-area" : image}
							/>
						</label>
						<input
							onChange={(e) => setImage(e.target.files[0])}
							type="file"
							name="image"
							id="image"
							required
							hidden
						/>
					</div>
					<div className="add-product-name flex-col">
						<p>Product Name</p>
						<input
							onChange={onChangeHandler}
							value={data.name}
							type="text"
							name="name"
							id="name"
							placeholder="Enter name of the product"
							required
						/>
					</div>
					<div className="add-product-description flex-col">
						<p>Product Description</p>
						<textarea
							onChange={onChangeHandler}
							value={data.description}
							type="text"
							rows="6"
							name="description"
							id="description"
							placeholder="Enter description of the product"
							required
						/>
					</div>
					<div className="add-category-price">
						<div className="add-product-category flex-col">
							<p>Product's Category</p>
							<select
								name="category"
								id="category"
								onChange={onChangeHandler}
								value={data.category}
							>
								<option value="Salad">Salad</option>
								<option value="Rolls">Rolls</option>
								<option value="Deserts">Deserts</option>
								<option value="Sandwich">Sandwich</option>
								<option value="Cake">Cake</option>
								<option value="Pure Veg">Pure Veg</option>
								<option value="Pasta">Pasta</option>
								<option value="Noodles">Noodles</option>
							</select>
						</div>
						<div className="add-product-price flex-col">
							<p>Product's Price (₹) </p>
							<input
								onChange={onChangeHandler}
								value={data.price}
								type="number"
								name="price"
								id="price"
								placeholder="Enter price(₹) "
								required
							/>
						</div>
					</div>
					<button className="add-button" type="submit">
						Add Item
					</button>
				</form>
			</div>
		</>
	);
};

export default Add;
