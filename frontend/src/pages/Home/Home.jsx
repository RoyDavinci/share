import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/index";
import { client } from "../../client";
import Logo from "../../assets/logo.png";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { userQuery } from "../../utils/data";
import { fetchUser } from "../../utils/fetchUser";

export const Home = () => {
	const [sidebar, setSideBar] = useState(false);
	const [user, setUser] = useState(null);
	const scrollRef = useRef(null);
	const navigate = useNavigate();

	const userInfo = fetchUser();

	useEffect(() => {
		const getData = async () => {
			if (userInfo) {
				try {
					const query = userQuery(userInfo.sub);
					const data = await client.fetch(query);
					console.log(data);
					setUser(data[0]);
				} catch (error) {
					console.log(error);
				}
			} else {
				navigate("/login");
			}
		};
		getData();
		return () => {
			console.log("start");
		};
	}, [navigate, userInfo]);

	useEffect(() => {
		scrollRef.current.scrollTo(0, 0);
	}, []);

	return (
		<div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
			<div className='hidden md:flex h-screen flex-initial'>
				<Sidebar user={user && user} closetoggle={setSideBar} />
			</div>
			<div className='flex md:hidden flex-row'>
				<div className='p-2 flex flex-row w-full justify-between items-center shadow-md'>
					<HiMenu
						fontSize={40}
						className='cursor-pointer'
						onClick={() => setSideBar(!sidebar)}
					></HiMenu>
					<Link to='/'>
						<img src={Logo} alt='logo' className='w-28' />
					</Link>
					<Link to={`user-profile/${user?._id}`}>
						<img src={user?.image} alt='user' className='w-28' />
					</Link>
				</div>
				{sidebar && (
					<div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
						<div className='absolute w-full flex justify-end items-center p-2'>
							<AiFillCloseCircle
								fontSize={30}
								className='cursor-pointer'
								onClick={() => setSideBar(!sidebar)}
							/>
						</div>
						<Sidebar user={user && user} closeToggle={setSideBar} />
					</div>
				)}
			</div>

			<div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
				<Outlet context={[user]} />
			</div>
		</div>
	);
};
