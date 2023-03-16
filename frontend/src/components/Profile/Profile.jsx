import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import {
	userCreatedPinsQuery,
	userQuery,
	userSavedPinsQuery,
} from "../../utils/data";
import { client } from "../../client";
import { MasonryLayout } from "../MasonryLayout/MasonryLayout";
import { Spinner } from "../Spinner/Spinner";

const randomImage =
	"https://source.unsplash.com/1600x900/?nature,photography,technology";

const activeBtnStyles =
	"bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
	"bg-primary-500 mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

export const Profile = () => {
	const [user, setUser] = useState(null);
	const [pins, setPins] = useState(null);
	const [text, setText] = useState("Created");
	const [activeBtn, setActiveBtn] = useState("created");

	const navigate = useNavigate();
	const { userId } = useParams();

	const logout = () => {
		localStorage.clear();
		googleLogout();
		navigate("/login");
	};

	useEffect(() => {
		const query = userQuery(userId);
		client.fetch(query).then((data) => setUser(data[0]));
	}, [userId]);

	useEffect(() => {
		if (text === "Created") {
			const createdPinsQuery = userCreatedPinsQuery(userId);
			client.fetch(createdPinsQuery).then((data) => setPins(data));
		} else {
			const savedPinsQuery = userSavedPinsQuery(userId);
			client.fetch(savedPinsQuery).then((data) => setPins(data));
		}
	}, [text, userId]);

	if (!user) return <Spinner message='Loading Profile'></Spinner>;
	return (
		<div className='relative pb-2 h-full justify-center items-center'>
			<div className='flex flex-col pb-5'>
				<div className='relative flex flex-col mb-7'>
					<div className='flex flex-col justify-center items-center'>
						<img
							src={randomImage}
							className='w-full h-370 2xl:h-510 object-cover shadow-lg'
							alt='banner'
						/>
						<img
							src={user.image}
							className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
							alt=''
						/>
						<h1 className='font-bold text-3xl text-center mt-3'>
							{user.username}
						</h1>
						<div className='absolute top-0 right-0 p-2 z-1'>
							{userId === user._id && (
								<div>
									<button
										className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
										onClick={logout}
									>
										<AiOutlineLogout color='red' fontSize={21} />
									</button>
								</div>
							)}
						</div>
					</div>
					<div className='text-center mb-7'>
						<button
							className={`${
								activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
							}`}
							onClick={(e) => {
								setText(e.target.textContent);
								setActiveBtn("created");
							}}
							type='button'
						>
							Created
						</button>
						<button
							className={`${
								activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
							}`}
							onClick={(e) => {
								setText(e.target.textContent);
								setActiveBtn("saved");
							}}
							type='button'
						>
							Saved
						</button>
					</div>
					{pins?.length ? (
						<div className='px-2'>
							<MasonryLayout pins={pins} />
						</div>
					) : (
						<div className='flex justify-center items-center font-bold w-full text-xl mt-2'>
							No Pins Found
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
