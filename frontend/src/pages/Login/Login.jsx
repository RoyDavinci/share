import React from "react";
// import GoogleLogin from "react-google-login";
import sshareVideo from "../../assets/share.mp4";
import Logo from "../../assets/logowhite.png";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { client } from "../../client";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	const navigate = useNavigate();
	const responseGoogle = (response) => {
		const data = jwt_decode(response.credential);
		localStorage.setItem("user", JSON.stringify(data));
		const { picture, name, email, sub } = data;
		console.log({ picture, name, email });
		const doc = {
			_id: sub,
			image: picture,
			username: name,
			_type: "user",
		};
		client.createIfNotExists(doc).then(() => {
			navigate("/", { replace: true });
		});
	};

	console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);

	return (
		<div className='flex justify-start items-center flex-col h-screen'>
			<div className='relative w-full h-full'>
				<video
					src={sshareVideo}
					type='video/mp4'
					loop
					controls={false}
					muted
					autoPlay
					className='w-full h-full object-cover'
				></video>
			</div>
			<div className='absolute flex flex-col justify-center items-center right-0 left-0 top-0 bottom-0 bg-blackOverlay'>
				<div className='p-5'>
					<div>
						<img src={Logo} className='' width='130px' alt='logo' />
					</div>
					{/* <div className='shadow 2xl'>
						<GoogleLogin
							render={(props) => (
								<button
									type='button'
									className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none my-4'
									onClick={props.onClick}
									disabled={props.disabled}
								>
									<FcGoogle className='mr-4' /> Sign In With Google
								</button>
							)}
							// clientId={process.env.REACT_GOOGLE_CLIENT_ID}
							clientId='927481040477-2kgkqq6r6i2ljboigol4fbcbm85freve.apps.googleusercontent.com'
							onSuccess={responseGoogle}
							onFailure={responseGoogle}
							cookiePolicy='single_host_origin'
						/>
					</div> */}
					<div className='shadow 2xl'>
						<div className='bg-mainColor flex justify-center items-center p-1 rounded-lg cursor-pointer outline-none my-4'>
							<GoogleLogin
								onSuccess={responseGoogle}
								onError={responseGoogle}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
