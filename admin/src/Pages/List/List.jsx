/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./List.css";

const List = ({ url }) => {
	const [list, setList] = useState([]);

	// const [list, setList] = useState({
	// 	name: "",
	// 	description: "",a
	// 	category: "Salad",
	// 	price: "",
	// 	image:""
	// });

	// const fetchList = async () => {
	// 	const response = await axios.get(`${url}/api/food/list`);
	// 	if (response.data.success) {
	// 		setList(response.data.data);
	// 		// toast.success(response.data.message);
	// 	}
	// 	// else {
	// 	// 	toast.error(response.data.message);
	// 	// }
	// };

	// useEffect(() => {
	// 	fetchList();
	// 	if (setList.length === 0) {
	// 		toast.error("Error to fetch menu details. Please try again.");
	// 	} else {
	// 		toast.success("Menu details loaded successfully.");
	// 	}
	// }, []);

	const fetchList = async () => {
		try {
			const response = await axios.get(`${url}/api/food/list`);
			if (response.data.success) {
				console.log(response.data.data);
				setList(response.data.data);
				toast.success(response.data.message);
				toast.success(
					"Menu contains " +
						`${response.data.data.length}` +
						" item(s)."
				);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			toast.error("Error to fetch menu details. Please try again.");
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	const removeFood = async (foodId) => {
		const response = await axios.post(`${url}/api/food/remove`, {
			id: foodId,
		});
		if (response.data.success) {
			toast.success(response.data.message);
			fetchList();
		} else {
			toast.error(response.data.message);
		}
	};

	return (
		<>
			<div className="list add flex-col">
				<p>All Foods List</p>
				<div className="list-table">
					<div className="list-table-format title">
						<b>Image</b>
						<b>Name</b>
						<b>Description</b>
						<b>Price</b>
						<b>Category</b>
						<b>Action</b>
					</div>
					{list.map((key, index) => {
						return (
							<>
								<div key={index} className="list-table-format">
									<img
										src={`${url}/images/` + key.image}
										alt={key.image}
									/>
									<p>{key.name}</p>
									<p>{key.description}</p>
									<p>₹{key.price}</p>
									<p>{key.category}</p>
									<p
										className="cursor"
										onClick={() => {
											removeFood(key._id);
										}}
									>
										X
									</p>
								</div>
							</>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default List;
