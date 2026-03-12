import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import energyReducer from '../store/slices/energySlice';
import ProtectedRoute from './layout/ProtectedRoute';

const makeStore = (isAuthenticated: boolean, role = 'Viewer') =>
  configureStore({
    reducer: { auth: authReducer, energy: energyReducer },
    preloadedState: {
      auth: {
        isAuthenticated,
        isLoading: false,
        error: null,
        user: isAuthenticated
          ? { id: '1', name: 'Test', email: 'test@test.com', role: role as any, region: 'Central' as any }
          : null,
      },
    },
  });

const renderWithProviders = (store: any, initialPath = '/protected') =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/unauthorised" element={<div>Unauthorised</div>} />
          <Route
            path="/protected"
            element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>}
          />
          <Route
            path="/admin-only"
            element={<ProtectedRoute allowedRoles={['Admin']}><div>Admin Content</div></ProtectedRoute>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithProviders(makeStore(false));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    renderWithProviders(makeStore(true));
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /unauthorised when role is not allowed', () => {
    const store = makeStore(true, 'Viewer');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin-only']}>
          <Routes>
            <Route path="/unauthorised" element={<div>Unauthorised</div>} />
            <Route
              path="/admin-only"
              element={<ProtectedRoute allowedRoles={['Admin']}><div>Admin Content</div></ProtectedRoute>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Unauthorised')).toBeInTheDocument();
  });

  it('renders admin content when user has Admin role', () => {
    const store = makeStore(true, 'Admin');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin-only']}>
          <Routes>
            <Route
              path="/admin-only"
              element={<ProtectedRoute allowedRoles={['Admin']}><div>Admin Content</div></ProtectedRoute>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
