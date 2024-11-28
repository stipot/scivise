import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Header from './Header'

function PrivateRouter({ isAuth }) {
	return isAuth ? (
		<>
			<Header />
			<Outlet />
		</>
	) : (
		<Navigate to="/login" />
	)
}

export default PrivateRouter
