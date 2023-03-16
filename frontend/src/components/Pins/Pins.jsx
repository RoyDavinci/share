import React, { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { NavBar } from "../index";
export const Pins = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [user] = useOutletContext();

	return (
		<div className='px-2 md:px-5'>
			<div className='bg-gray-50'>
				<NavBar
					user={user}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
			</div>
			<div className='h-full'>
				<Outlet context={[user, searchTerm]} />
			</div>
		</div>
	);
};
