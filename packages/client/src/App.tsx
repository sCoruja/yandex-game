import './App.css'
import { Route, Routes } from 'react-router-dom'
import { GamePage, MainPage } from './pages/'
import { Layout } from './components'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Layout>
  )
}

export default App
