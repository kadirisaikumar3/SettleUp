import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!isLogin && !form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const response = await loginUser({
          email: form.email.trim(),
          password: form.password,
        });

        const { token, user } = response.data;

        localStorage.setItem("settleup_token", token);
        localStorage.setItem("settleup_user", JSON.stringify(user));

        onLogin(user);
      } else {
        await registerUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        setSuccess("Registration successful. You can now log in.");

        setForm({
          name: "",
          email: form.email.trim(),
          password: "",
        });

        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin((currentMode) => !currentMode);
    setError("");
    setSuccess("");

    setForm({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">S</div>

          <div>
            <strong>SettleUp</strong>
            <span>Group Expense Engine</span>
          </div>
        </div>

        <div className="auth-header">
          <span className="eyebrow">
            {isLogin ? "WELCOME BACK" : "GET STARTED"}
          </span>

          <h1>{isLogin ? "Sign in to SettleUp" : "Create your account"}</h1>

          <p>
            {isLogin
              ? "Manage your groups, expenses and settlements."
              : "Start managing shared expenses with SettleUp."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label className="form-field">
              <span>Name</span>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </label>
          )}

          <label className="form-field">
            <span>Email</span>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </label>

          <label className="form-field">
            <span>Password</span>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          {success && <p className="form-success">{success}</p>}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>

          <button type="button" onClick={switchMode}>
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
