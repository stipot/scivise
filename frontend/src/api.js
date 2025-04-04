import axios from 'axios'

export const ADDRESS = process.env.REACT_APP_SERVER_ADDRESS
	? process.env.REACT_APP_SERVER_ADDRESS
	: 'https://scivise.com/api' //'http://localhost:3010/'

const API = axios.create({
	baseURL: ADDRESS,
	timeout: 5000,
})

let refreshRequest = null

API.interceptors.response.use(
	(response) => {
		return response
	},
	async function (error) {
		const originalReq = error.config

		if (error.response?.status === 401 && !originalReq._isRetried) {
			originalReq._isRetried = true

			try {
				if (!refreshRequest) {
					refreshRequest = API.post('/auth/update_refresh_token', {
						refresh: localStorage.getItem('refresh'),
					})
				}
				const res = await refreshRequest
				localStorage.setItem('refresh', res.data.refresh)
				refreshRequest = null
			} catch (e) {
				if (e.response?.status !== 400) {
					originalReq._isRetried = false
				}
			}
			return API(originalReq)
		}
		return Promise.reject(error)
	}
)

export default API
