import React from 'react'
import { Link } from 'react-router-dom'
import './SignUp.css'
import { useForm } from 'react-hook-form'

function SignUp() {
	const { register, handleSubmit, formState } = useForm()

	function signUp(data) {
		console.log('sign up', data)
	}

	return (
		<div className="center_content_page">
			<div className="sign_up_form_wrapper">
				<h2>Регистрация</h2>
				<form
					onSubmit={handleSubmit(signUp)}
					className="sign_up_form column_form"
				>
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
					Уже зарегистрированы? <Link to="/login">Войти</Link>
				</p>
			</div>
		</div>
	)
}

export default SignUp
