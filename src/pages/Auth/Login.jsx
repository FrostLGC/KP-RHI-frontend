import { useState, useContext, useEffect } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const { updateUser } = useContext(UserContext) // Ambil fungsi updateUser dari context
  const navigate = useNavigate();

  // Fungsi untuk menangani login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Email tidak valid");
      return;
    }

    if (!password) {
      setError("Password tidak boleh kosong");
      return;
    }

    setError("");

    // melakukan login ke API
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data); // Simpan token ke localStorage

          if (role === "admin") {
            navigate("/admin/dashboard"); // Ganti dengan route admin dashboard
          } else {
            navigate("/user/dashboard"); // Ganti dengan route user dashboard
          };
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message); // Tampilkan pesan error dari server
      } else {
        setError("Terjadi kesalahan, silakan coba lagi"); // Tampilkan pesan error umum
      }
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };
  
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center items-center">
        <h3 className="text-xl font-semibold text-black -mt-1">
          Selamat Datang
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Silakan masukkan email dan password
        </p>

        <form
          onSubmit={handleLogin}
          onKeyDown={handleEnter}
          className="w-full flex flex-col gap-4"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-gray-600 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Password"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

          <p className="text-xs text-slate-800 mt-3">
            Belum punya akun?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
