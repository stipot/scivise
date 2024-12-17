import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import General from './pages/General'
import SavedArticles from './pages/SavedArticles'
import Header from './components/Header'

function App() {
	return (
		<Router>
			<Header/>
			<Routes>
				<Route path="/" element={<General />} />
				<Route path="/favorites" element={<SavedArticles />} />
			</Routes>
		</Router>
	)
}

export default App
