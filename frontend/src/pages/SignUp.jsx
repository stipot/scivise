import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SignUp.css'
import { useForm } from 'react-hook-form'
import API from '../api'

function SignUp() {
	const { register, handleSubmit, formState } = useForm()
	const [error, setError] = useState('')
	const [registered, setRegistered] = useState(false)

	async function signUp(data) {
		try {
			await API.post('/auth/registration', { ...data })
		} catch (e) {
			console.log(e)
			setRegistered(false)
			if (e.response.data) {
				setError(e.response.data)
			} else {
				setError('Неизвестная ошибка')
			}
			return
		}
		setError('')
		setRegistered(true)
	}

	return (
		<div className="center_content_page">
			<div className="sign_up_form_wrapper">
				<h2>Регистрация</h2>
				{error && <p className="form_error">{error}</p>}
				{registered && (
					<p className="form_success">Регистрация прошла успешно</p>
				)}
				<form
					onSubmit={handleSubmit(signUp)}
					className="sign_up_form column_form"
				>
					<input
						type="text"
						placeholder="Логин"
						{...register('username', { required: true, minLength: 4 })}
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
						Зарегистрироваться
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
