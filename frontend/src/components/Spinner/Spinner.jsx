import React from "react";
import { Circles } from "react-loader-spinner";

export const Spinner = ({ message }) => {
	return (
		<div className='flex flex-col justify-center items-center w-full h-full'>
			<div className='m-5'>
				<Circles type={Circles} height={50} width={200} />
			</div>
			<p className='text-lg text-center px-2'>{message}</p>
		</div>
	);
};
