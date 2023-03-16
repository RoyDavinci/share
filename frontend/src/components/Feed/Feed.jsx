import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../client";
import { feedQuery, searchQuery } from "../../utils/data";
import { MasonryLayout } from "../MasonryLayout/MasonryLayout";
import { Spinner } from "../Spinner/Spinner";

export const Feed = () => {
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState();

	const { categoryId } = useParams();

	useEffect(() => {
		const getITem = async () => {
			setLoading(true);
			if (categoryId) {
				try {
					const query = searchQuery(categoryId);
					const data = await client.fetch(query);
					setLoading(false);
					setItems(data);
				} catch (error) {}
			} else {
				const data = await client.fetch(feedQuery);
				setLoading(false);
				setItems(data);
			}
		};
		getITem();
	}, [categoryId, setItems]);

	if (loading)
		return <Spinner message='We are adding new things to your fields' />;

	if (!items?.length) return <h2>No Items Available</h2>;

	return <div>{items && <MasonryLayout pins={items} />}</div>;
};
