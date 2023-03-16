import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { client } from "../../client";
import { Spinner } from "../Spinner/Spinner";
import { categories } from "../../utils/data";
import { useState } from "react";

export const CreatePin = () => {
	const [pin, setPin] = useState({
		title: "",
		destination: "",
		about: "",
		category: "",
	});
	const [loading, setLoading] = useState(false);
	const [fields, setFields] = useState({
		category: null,
		imageAsset: null,
		imageType: false,
	});

	const [user] = useOutletContext();
	console.log(user);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPin({ ...pin, [name]: value });
	};

	const uploadImage = (e) => {
		const { type, name } = e.target.files[0];
		if (
			type === "image/png" ||
			type === "image/svg" ||
			type === "image/jpeg" ||
			type === "image/gif" ||
			type === "image/tiff"
		) {
			setLoading(true);
			setFields({ imageAsset: true });
			client.assets
				.upload("image", e.target.files[0], {
					contentType: type,
					filename: name,
				})
				.then((doc) => {
					setFields({ imageAsset: doc });
					setLoading(false);
				})
				.catch((err) => {
					console.log("object", err);
				});
		} else {
			setFields({ imageType: true });
		}
	};

	const savePin = async (e) => {
		e.preventDefault();
		if (fields.imageAsset?._id) {
			const doc = {
				_type: "pin",
				title: pin.title,
				about: pin.about,
				destination: pin.destination,
				category: pin.category,
				image: {
					_type: "image",
					asset: {
						_type: "reference",
						_ref: fields.imageAsset._id,
					},
				},
				userId: user._id,
				postedBy: {
					_type: "postedBy",
					_ref: user._id,
				},
			};
			client
				.create(doc)
				.then(() => navigate("/"))
				.catch((err) => console.log(err));
		}
	};

	return (
		<div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
			<div className='flex lg:flex-row flex-col lg:p-5 p-3 lg:w-4/5 w-full justify-center items-center bg-white'>
				<div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
					<div className='flex justify-center items-center flex-col border-2 border-dotted p-3 border-gray-300 w-full h-420'>
						{loading && <Spinner />}
						{fields.imageType && <p>Wrong Image Type</p>}
						{!fields.imageAsset ? (
							<label>
								<div className='flex flex-col items-center justify-center h-full'>
									<div className='flex flex-col justify-center items-center'>
										<p className='font-bold text-2xl '>
											<AiOutlineCloudUpload />
										</p>
										<p className='text-lg'>Click To Upload</p>
									</div>
									<p className='text-gray-400 mt-32'>
										Recommendation: use high quality Jpeg/Png/Gif less than 20mb
									</p>
								</div>
								<input
									type='file'
									name='upload-image'
									onChange={uploadImage}
									className='w-0 h-0'
									id=''
								/>
							</label>
						) : (
							<div className='relative h-full'>
								<img
									src={fields.imageAsset?.url}
									alt='upload'
									className='h-full w-full'
								/>
								<button
									type='button'
									className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
									onClick={() => setFields({ imageAsset: null })}
								></button>
							</div>
						)}
					</div>
				</div>
				<div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full '>
					<input
						type='text'
						className='outline-none text-xl sm:text-3xl font-bold border-b-2 border-gray-300 p-2'
						value={pin.title}
						name='title'
						onChange={handleChange}
						placeholder='add your title'
					/>
					{user && (
						<div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
							<img
								src={user?.image}
								alt=''
								className='w-10 h-10 rounded-full'
							/>
							<p className='font-bold'>{user?.username}</p>
						</div>
					)}
					<input
						type='text'
						className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-300 p-2'
						value={pin.about}
						name='about'
						onChange={handleChange}
						placeholder='what is your pin about'
						required
					/>
					<input
						type='text'
						className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-300 p-2'
						value={pin.destination}
						name='destination'
						onChange={handleChange}
						placeholder='add a destination link'
						required
					/>
					<div className='flex flex-col'>
						<div>
							<p className='mb-2 font-semibold text-lg sm:text-xl'>
								Choose Pin Category
							</p>
							<select
								name='category'
								onChange={handleChange}
								className='outline-none w-4/5 text-base border-b-2 border-gray-200 rounded-md cursor-pointer p-2'
								id=''
								required
							>
								<option value='other' className='bg-white'>
									Select Catrgory
								</option>
								{categories.map((item) => {
									return (
										<option
											className='text-base border-0 outline-none capitalize bg-white text-black'
											value={item.name}
										>
											{item.name}
										</option>
									);
								})}
							</select>
						</div>
						<div className='flex justify-end items-end mt-5'>
							<button
								type='button'
								onClick={savePin}
								className='bg-red-500 text-white outline-none font-bold p-2 rounded-full w-28'
							>
								Save Pin
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
