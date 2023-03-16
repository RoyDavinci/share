import React from "react";
import "./sidebar.css";
import { Link, NavLink } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
// import { IoIosArrowForward } from "react-icons/io";
import Logo from "../../assets/logo.png";
import { categories } from "../../utils/data";

export const Sidebar = ({ user, closeToggle }) => {
	const handleCloseSidebar = () => {
		if (closeToggle) {
			closeToggle(false);
		}
	};

	const isNotActiveStyle =
		"flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
	const isActiveStyle =
		"flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";

	return (
		<div className='flex flex-col justify-between overflow-y-scroll min-w-210 bg-white hifull hide-scrollbar'>
			<div className='flex flex-col'>
				<Link
					to='/'
					className='w-[190px] items-center flex px-5 gap-2 my-6 pt-1'
					onClick={handleCloseSidebar}
				>
					<img src={Logo} alt='logo' className='w-full' />
				</Link>
				<div className='flex flex-col gap-5'>
					<NavLink
						to='/'
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
					>
						<RiHomeFill />
						Home
					</NavLink>
					<h3 className='mt-2 px-5 text-base 2xl:text-xl'>
						Discover Categories
					</h3>
					{categories.slice(0, categories.length - 1).map((item) => {
						return (
							<NavLink
								to={`/category/${item.name}`}
								className={({ isActive }) =>
									isActive ? isActiveStyle : isNotActiveStyle
								}
								onClick={handleCloseSidebar}
								key={item.name}
							>
								<img
									src={item.image}
									className='w-8 h-8 rounded-full shadow-sm '
									alt='category'
								/>
								{item.name}
							</NavLink>
						);
					})}
				</div>
			</div>
			{user && (
				<div>
					<Link
						to={`user-profile/:${user._id}`}
						className='flex my-5 mb-3 gap-2 p-2 items-center bg-white shadow-lg rounded-lg mx-3'
						onClick={handleCloseSidebar}
					>
						<img src={user.image} className='w-10 rounded-full h-10' alt='' />
						<p>{user.username}</p>
					</Link>
				</div>
			)}
		</div>
	);
};
