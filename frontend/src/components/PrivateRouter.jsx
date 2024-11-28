import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

function PrivateRouter({ isAuth }) {
	return isAuth ? (
		<>
			<Outlet />
		</>
	) : (
		<Navigate to="/login" />
	)
}

export default PrivateRouter
