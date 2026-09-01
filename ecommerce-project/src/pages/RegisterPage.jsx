import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import './auth.css';
import { Header } from '../components/Header';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password
      );

      await login(
        form.email,
        form.password
      );

      navigate('/');
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <Header cart={[]} />

    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          Create your account
        </div>

        <h1>Register</h1>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password (minimum 6 characters)"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <NavLink to="/login">
            Login
          </NavLink>
        </div>
      </div>
    </div>
  </>
);
}