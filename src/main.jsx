import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapPage from './pages/MapPage';
import LineChartPage from './pages/LineChartPage';
import BarChartPage from './pages/BarChartPage';
import GraphPage from './pages/GraphPage';
import './style.css';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Map of Washington State</Link></li>
          <li><Link to="/line-chart">Line Chart</Link></li>
          <li><Link to="/bar-chart">Bar Chart</Link></li>
          <li><Link to="/graph">Graph</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/line-chart" element={<LineChartPage />} />
        <Route path="/bar-chart" element={<BarChartPage />} />
        <Route path="/graph" element={<GraphPage />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
