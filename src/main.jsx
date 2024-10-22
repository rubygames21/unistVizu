import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapPage from './pages/Map/MapPage';
import LineChartPage from './pages/LineChart/LineChartPage';
import BarChartPage from './pages/BarChart/BarChartPage';
import GraphPage from './pages/Graph/GraphPage';
import './style.css';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/MapPage">Map of Washington State</Link></li>
          <li><Link to="/line-chart">Line Chart</Link></li>
          <li><Link to="/bar-chart">Bar Chart</Link></li>
          <li><Link to="/graph">Graph</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/MapPage" element={<MapPage />} />
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
