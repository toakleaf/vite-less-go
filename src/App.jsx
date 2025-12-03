import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AnimalProfile from './pages/animals'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":slug" element={<AnimalProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
