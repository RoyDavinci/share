import React, { useState } from "react";
import { urlFor, client } from "../../client";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { fetchUser } from "../../utils/fetchUser";

export const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
	const [postHovered, setPostHovered] = useState(false);
	const navigate = useNavigate();

	const userInfo = fetchUser();

	const alreadySaved = !!save?.filter(
		(item) => item.postedBy._id === userInfo.sub
	)?.length;

	const deletePin = (id) => {
		client.delete(id).then(() => {
			window.location.reload();
		});
	};

	const savePin = (id) => {
		if (!alreadySaved) {
			client
				.patch(id)
				.setIfMissing({ save: [] })
				.insert("after", "save[-1]", [
					{
						key: uuid(),
						userId: userInfo.sub,
						postedBy: {
							_type: "postedBy",
							_ref: userInfo.sub,
						},
					},
				])
				.commit()
				.then(() => {
					window.location.reload();
				});
		}
	};

	return (
		<div className='m-2'>
			<div
				onMouseEnter={() => setPostHovered(true)}
				onMouseLeave={() => setPostHovered(false)}
				onClick={() => navigate(`/pin-detail/${_id}`)}
				className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition duration-500 ease-in-out'
			>
				<img
					src={urlFor(image).width(250).url()}
					className='rounded-lg w-full '
					alt='user-post'
				/>
				{postHovered && (
					<div
						className='absolute top-0 w-full h-full flex flex-col justify-between pb-2 pr-2 pt-2 z-50 p-1'
						style={{ height: "100%" }}
					>
						<div className='flex items-center justify-between'>
							<div className='flex gap-2'>
								<a
									href={`${image?.asset?.url}?dl=`}
									download
									onClick={(e) => e.stopPropagation()}
									className='bg-white h-9 w-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
								>
									<MdDownloadForOffline />
								</a>
							</div>
							{alreadySaved ? (
								<button
									type='button'
									className='bg-blue-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
								>
									Saved
								</button>
							) : (
								<button
									type='button'
									className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
									onClick={(e) => {
										e.stopPropagation();
										savePin(_id);
									}}
								>
									Save
								</button>
							)}
						</div>
						<div className='flex justify-between items-center gap-2 w-full'>
							{image?.asset?.url && (
								<a
									href={image?.asset?.url}
									target='_blank'
									rel='noreferrer'
									className='bg-white text-black font-bold p-1 gap-2 items-center flex pl-2 pr-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md text-[12px]'
									onClick={(e) => {
										e.stopPropagation();
									}}
								>
									<BsFillArrowRightCircleFill />
									{image?.asset?.url.slice(22, 27)}
								</a>
							)}
							{postedBy._id === userInfo.sub && (
								<button
									type='button'
									onClick={(e) => {
										e.stopPropagation();
										deletePin(_id);
									}}
									className='bg-white opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
								>
									<AiTwotoneDelete />
								</button>
							)}
						</div>
					</div>
				)}
			</div>
			<Link
				to={`user-profile/${postedBy?._id}`}
				className='flex items-center gap-2 mt-2'
			>
				<img
					src={postedBy?.image}
					alt='user'
					className='w-8 h-8 rounded-full object-cover'
				/>
				<p className='font-semibold capitalize'>{postedBy?.username}</p>
			</Link>
		</div>
	);
};
