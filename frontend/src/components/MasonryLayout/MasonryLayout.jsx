import React from "react";
import Masonry from "react-masonry-css";
import { Pin } from "../Pin/Pin";

export const MasonryLayout = ({ pins }) => {
	const breakpointObj = {
		default: 4,
		3000: 6,
		2000: 5,
		1200: 3,
		1000: 2,
		500: 1,
	};

	console.log(pins);
	return (
		<div>
			<Masonry
				breakpointCols={breakpointObj}
				className='flex animate-slide-fwd'
			>
				{pins.map((pin) => (
					<Pin className='w-max' key={pin._id} pin={pin} />
				))}
			</Masonry>
		</div>
	);
};
