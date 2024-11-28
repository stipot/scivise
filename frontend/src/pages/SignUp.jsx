import React from 'react'
import { Link } from 'react-router-dom'
import './SignUp.css'

function SignUp() {
	function signUp(e) {
		e.preventDefault()
	}

	return (
		<div className="center_content_page">
			<div className="sign_up_form_wrapper">
				<form action="" className="sign_up_form column_form">
					<input type="text" placeholder="Логин" />
					<input type="text" placeholder="Пароль" />
					<button type="submit" onClick={(e) => signUp(e)}>
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
