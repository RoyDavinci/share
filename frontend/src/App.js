import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Error, Home, Login } from "./pages";
import {
	CreatePin,
	Feed,
	PinDetail,
	Pins,
	Profile,
	Search,
} from "./components";

function App() {
	const router = createBrowserRouter([
		{
			element: <Home />,
			children: [
				{
					element: <Profile />,
					path: "/user-profile/:userId",
				},
				{
					element: <Pins />,
					children: [
						{
							path: "/",
							element: <Feed />,
						},
						{
							path: "category/:categoryId",
							element: <Feed />,
						},
						{
							path: "/pin-detail/:pinId",
							element: <PinDetail />,
						},
						{
							path: "create-pin",
							element: <CreatePin />,
						},
						{
							path: "search",
							element: <Search />,
						},
					],
				},
			],
		},
		{
			element: <Login />,
			path: "/login",
		},
		{
			element: <Error />,
			path: "*",
		},
	]);

	return (
		<div className='App'>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
