import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import './auth.css';
import { Header } from '../components/Header';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((previousForm) => ({
      ...previousForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);

      setError(
        error.response?.data?.message ||
        'Login failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header cart={[]} />

      <main className="auth-page">
        <div className="auth-card">

          <div className="auth-brand">
            Welcome back
          </div>

          <h1>Login</h1>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          <div className="auth-footer">
            Don't have an account?{' '}

            <NavLink to="/register">
              Create account
            </NavLink>
          </div>

        </div>
      </main>
    </>
  );
}