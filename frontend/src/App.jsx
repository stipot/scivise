import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import General from './pages/General'
import SavedArticles from './pages/SavedArticles'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import './App.css'
import { initDB } from './db'
import { StyledEngineProvider } from '@mui/material'

function App() {
	useEffect(() => {
		initDB()
	}, [])

	return (
		<StyledEngineProvider injectFirst>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<General />} />
					<Route path="/user/:pageName" element={<SavedArticles />} />
					<Route path="/*" element={<NotFound />} />
					<Route path="/404" element={<NotFound />} />
				</Routes>
			</Router>
		</StyledEngineProvider>
	)
}

export default App
