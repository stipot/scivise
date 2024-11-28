import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import { AppContext } from '../context/AppContext'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

function Login() {
	const { isAuth, setIsAuth, setLogin } = useContext(AppContext)
	const { register, handleSubmit, formState } = useForm()

	function login(data) {
		setLogin(data.login)
		setIsAuth(true)
		console.log('login', data)
	}

	return (
		<div className="center_content_page">
			<div className="login_form_wrapper">
				<h2>Вход</h2>
				<form onSubmit={handleSubmit(login)} className="login_form column_form">
					<input
						type="text"
						placeholder="Логин"
						{...register('login', { required: true, minLength: 4 })}
					/>
					<input
						type="text"
						placeholder="Пароль"
						{...register('password', { required: true, minLength: 4 })}
					/>
					<button
						type="submit"
						disabled={formState.isSubmitting || !formState.isValid}
					>
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
