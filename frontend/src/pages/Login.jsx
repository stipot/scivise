import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import { AppContext } from '../context/AppContext'
import { Navigate } from 'react-router-dom'

function Login() {
	const { isAuth, setIsAuth } = useContext(AppContext)

	function login(e) {
		e.preventDefault()
		setIsAuth(true)
		console.log(123)
	}

	return (
		<div className="login_page">
			<div className="login_form_wrapper">
				<form action="" className="login_form">
					<input type="text" placeholder="Логин" />
					<input type="text" placeholder="Пароль" />
					<button type="submit" onClick={(e) => login(e)}>
						Войти
					</button>
				</form>
				<p>
					Нет аккаунта? <Link to="/sign_up">Зарегистрироваться</Link>
				</p>
			</div>
			{isAuth && <Navigate to={'/'} />}
		</div>
	)
}

export default Login
