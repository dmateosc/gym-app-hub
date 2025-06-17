import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import GymsPage from './pages/GymsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/gyms" element={<GymsPage />} />
              <Route path="/members" element={<div className="container mt-4"><h2>Members (Coming Soon)</h2></div>} />
              <Route path="/exercises" element={<div className="container mt-4"><h2>Exercises (Coming Soon)</h2></div>} />
              <Route path="/workout-plans" element={<div className="container mt-4"><h2>Workout Plans (Coming Soon)</h2></div>} />
              <Route path="/trainers" element={<div className="container mt-4"><h2>Trainers (Coming Soon)</h2></div>} />
              <Route path="/sessions" element={<div className="container mt-4"><h2>Sessions (Coming Soon)</h2></div>} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
