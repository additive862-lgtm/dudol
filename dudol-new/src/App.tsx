import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import DataRoom from './pages/DataRoom';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dataroom" element={<DataRoom />} />
          {/* Fallback for demo routes */}
          <Route path="/homily" element={<div className="p-20 text-center">강론 페이지 (준비중)</div>} />
          <Route path="/community" element={<div className="p-20 text-center">커뮤니티 페이지 (준비중)</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
