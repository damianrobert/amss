import {Link} from 'react-router-dom';

const NotFoundPage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
			<h1 className="text-6xl font-bold text-white">404</h1>
			<h2 className="text-2xl font-semibold mt-4 text-white">Oops! Page not found</h2>

			<Link
				to="/"
				className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded-md shadow hover:bg-blue-600 hover:text-white  transition-colors"
			>
				Back to Home
			</Link>
		</div>
	);
};

export default NotFoundPage;
