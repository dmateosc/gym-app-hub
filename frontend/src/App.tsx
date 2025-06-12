import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Layout/Navbar';
import { UserListPage } from '@/pages/UserListPage';
import { CreateUserPage } from '@/pages/CreateUserPage';
import { EditUserPage } from '@/pages/EditUserPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-vh-100 bg-light">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<UserListPage />} />
              <Route path="/users/new" element={<CreateUserPage />} />
              <Route path="/users/edit/:id" element={<EditUserPage />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;