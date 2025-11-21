import React, { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    address: "",
    password: "",
    email: "",
    phno: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password strength function
  const getPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength++;           // length
    if (/[A-Z]/.test(password)) strength++;        // uppercase
    if (/[a-z]/.test(password)) strength++;        // lowercase
    if (/[0-9]/.test(password)) strength++;        // numbers
    if (/[\W_]/.test(password)) strength++;        // special characters

    if (strength <= 2) return "Weak";
    else if (strength === 3 || strength === 4) return "Medium";
    else return "Strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Row 1: Username + Firstname */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Row 2: Lastname + Address */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="form-control scrollable"
          />
        </div>
      </div>

      {/* Row 3: Email + Password */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6 position-relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
          />
          {/* Eye icon toggle */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: "pointer", fontSize: "1.2rem", color: "#495057" }}
          >
            {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
          </span>
          {formData.password && (
            <small
              className={`form-text ${
                passwordStrength === "Strong"
                  ? "text-success"
                  : passwordStrength === "Medium"
                  ? "text-warning"
                  : "text-danger"
              }`}
            >
              Password Strength: {passwordStrength}
            </small>
          )}
        </div>
      </div>

      {/* Row 4: Phone Number */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <input
            type="tel"
            name="phno"
            placeholder="Phone Number"
            value={formData.phno}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Submit button */}
      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </form>
  );
}
