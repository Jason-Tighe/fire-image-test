import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import routes from './routes';


const AppRouter = () => {
	return (
		<Router>
			<Routes>
				{routes.map(({ Component, key, path }) => (
					<Route
						key={key}
						path={path}
						exact
						component={() => <Component page={key} />}
					></Route>
				))}
			</Routes>
		</Router>
	);
};

export default AppRouter;
