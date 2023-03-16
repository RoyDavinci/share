import React, { useState, useEffect } from "react";
import { useOutletContext, Link, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { client, urlFor } from "../../client";
import { MdDownloadForOffline } from "react-icons/md";
import { MasonryLayout } from "../MasonryLayout/MasonryLayout";
import { pinDetailQuery, pinDetailMorePinQuery } from "../../utils/data";
import { Spinner } from "../Spinner/Spinner";
import { useCallback } from "react";

export const PinDetail = () => {
	const [user] = useOutletContext();
	const [pinDetail, setPinDetail] = useState();
	const [comment, setComment] = useState("");
	const [addmingComment, setAddingComment] = useState(false);
	const [pin, setPins] = useState();

	const { pinId } = useParams();
	const fetechPinDetaills = useCallback(() => {
		let query = pinDetailQuery(pinId);
		if (query) {
			client.fetch(query).then((data) => {
				setPinDetail(data[0]);
				if (data[0]) {
					query = pinDetailMorePinQuery(data[0]);
					client.fetch(query).then((res) => setPins(res));
				}
			});
		}
	}, [pinId]);

	const addComment = () => {
		if (comment) {
			setAddingComment(true);
			client
				.patch(pinId)
				.setIfMissing({ comments: [] })
				.insert("after", "comments[-1]", [
					{
						comment,
						_key: uuid(),
						postedBy: {
							_type: "postedBy",
							_ref: user._id,
						},
					},
				])
				.commit()
				.then((res) => {
					console.log(res);
					fetechPinDetaills();
					setComment("");
					setAddingComment(false);
				});
		}
	};

	console.log(pinDetail);

	useEffect(() => {
		fetechPinDetaills();
	}, [fetechPinDetaills]);

	if (!pinDetail) {
		return <Spinner message='Loading Pins' />;
	}

	return (
		<>
			<div>
				<div
					className='flex xl-flex-row flex-col m-auto bg-white'
					style={{ maxWidth: "1500px", borderRadius: "32px" }}
				>
					<div className='flex justify-center items-center md:items-start flex-initial'>
						<img
							src={pinDetail.image && urlFor(pinDetail.image)}
							alt='user-post'
							className='rounded-t-3xl rounded-b-lg'
						/>
					</div>
					<div className='w-full p-5 flex-1 xl:min-w-620'>
						<div className='flex justify-between items-center'>
							<div className='flex gap-2 items-center'>
								<a
									href={`${pinDetail?.image?.asset?.url}?dl=`}
									download
									onClick={(e) => e.stopPropagation()}
									className='bg-white h-9 w-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
								>
									<MdDownloadForOffline />
								</a>
							</div>
							<a
								href={`${pinDetail.destination}`}
								target='_blank'
								rel='noreferrer'
							>
								{pinDetail.destination}
							</a>
						</div>
						<div>
							<h1 className='flex-4xl font-bold mt-3 break-words'>
								{pinDetail.title}
							</h1>
							<p className='mt-3 '>{pinDetail.about}</p>
						</div>
						<Link
							to={`user-profile/${pinDetail.postedBy?._id}`}
							className='flex gap-2 mt-5 items-center bg-white rounded-lg'
						>
							<img
								src={pinDetail.postedBy?.image}
								alt='user'
								className='w-8 h-8 rounded-full object-cover'
							/>
							<p className='font-semibold capitalize'>
								{pinDetail.postedBy?.username
									? pinDetail.postedBy?.username
									: pinDetail.title}
							</p>
						</Link>
						<h2 className='mt-5 text-2xl'>Comments</h2>
						<div className='max-h-370 overflow-y-auto'>
							{pinDetail.comments &&
								pinDetail.comments.map((item, index) => {
									return (
										<div
											className='flex gap-2 mt-5 items-center bg-white rounded-lg'
											key={index}
										>
											<img
												src={item.postedBy.image}
												alt='user-profile'
												className='w-10 h-10 rounded-full cursor-pointer'
											/>
											<div className='flex flex-col'>
												<p className='font-bold '>{item.postedBy.username}</p>
												<p>{item.comment}</p>
											</div>
										</div>
									);
								})}
						</div>
						<div className='flex flex-wrap mt-6 gap-3'>
							<Link to={`user-profile/${pinDetail.postedBy?._id}`} className=''>
								<img
									src={pinDetail.postedBy?.image}
									alt='user'
									className='w-8 h-8 rounded-full cursor-pointer'
								/>
							</Link>
							<input
								className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
								type='text'
								placeholder='Add comment'
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
							<button
								className='bg-red-500 text-white rounded-full px-6 py-2 font-semi-bold text-base outline-none'
								type='button'
								onClick={addComment}
							>
								{addmingComment ? "Posting the comment" : "Post"}
							</button>
						</div>
					</div>
				</div>
			</div>
			{pin?.length > 0 ? (
				<>
					<h2 className='text-center font-bold text-2xl mt-8 mb-4'>
						More Like This
					</h2>
					<MasonryLayout pins={pin} />
				</>
			) : (
				<Spinner message='Loading more pins'></Spinner>
			)}
		</>
	);
};
