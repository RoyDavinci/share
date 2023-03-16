import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

export const NavBar = ({ user, searchTerm, setSearchTerm }) => {
	const navigate = useNavigate();

	if (!user) return null;

	return (
		<div className='flex gap-2 w-full pb-5 md:gap-5 mt-5'>
			<div className='flex items-center justify-start w-full px-2 bg-white rounded-medium border-none outline-none focus-within:shadow-sm'>
				<IoMdSearch fontSize={21} className='ml-1' />
				<input
					type='text'
					onChange={(e) => setSearchTerm(e.target.value)}
					value={searchTerm}
					placeholder='Search'
					onFocus={() => navigate("/search")}
					className='p-2 outline-none w-full bg-white'
				/>
			</div>
			<div className='flex gap-3'>
				<Link to={`user-profile/${user?._id}`} className='hidden md:block'>
					<img src={user.image} alt='user' className='w-14 h-12 rounded-full' />
				</Link>
				<Link
					to='create-pin'
					className='w-12 h-12 rounded-full bg-black text-white md:w-14 md:h-12 flex justify-center items-center'
				>
					<IoMdAdd fontSize={30} />
				</Link>
			</div>
		</div>
	);
};
