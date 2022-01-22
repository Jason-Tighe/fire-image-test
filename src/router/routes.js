import React from 'react';
import App from '../App';
import SignUp from '../SignUp'

const routes = [
	{
		Component: SignUp,
		key: 'SignUp',
		path: '/SignUp'
	},
	{
		Component: App,
		key: 'App',
		path: '/'
	}
];

export default routes;
