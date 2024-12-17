import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import General from './pages/General'
import SavedArticles from './pages/SavedArticles'

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<General />} />
				<Route path="/favorites" element={<SavedArticles />} />
			</Routes>
		</Router>
	)
}

export default App
