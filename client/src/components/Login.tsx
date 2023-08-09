import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import Modal from "./Model";

interface LoginModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

enum AuthMode {
  Login,
  Register,
}

const LoginModal: React.FC<LoginModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.Login);

  const authContext = useAuthContext(); // Access the auth context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === AuthMode.Login) {
      await authContext?.login(email, password);
    } else {
      await authContext?.register(username, email, password); // You can set a username here
    }
  };

  const isLoading = authContext?.loading || false;

  return (
    <Modal
      isOpen={authContext?.user === null ? true : isModalOpen}
      title={authMode === AuthMode.Login ? "Login" : "Register"}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="">
        <div className="px-10">
          <h4 className="text-lg mb-6 text-center">
            {authMode === AuthMode.Login
              ? "Hello! Welcome back"
              : "Create an account"}
          </h4>
          {authContext?.error && (
            <div className="text-red-500 text-sm mb-4">
              {authContext?.error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {authMode === AuthMode.Register && (
              <div className="mb-4">
                <label htmlFor="Username" className="block text-sm mb-2">
                  Username
                </label>
                <div className="relative flex items-center ">
                  <FaUser className="absolute text-blue-500 left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    id="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your Username"
                    required
                    className="w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 pl-10 bg-transparent"
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="Email" className="block text-sm mb-2">
                Email
              </label>
              <div className="relative flex items-center ">
                <FaEnvelope className="absolute text-blue-500 left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  id="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  required
                  className="w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 pl-10 bg-transparent"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <FaLock className="absolute text-blue-500 left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="*********"
                  className="w-full border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 pl-10 bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg_blue_gradient text-white hover:bg-opacity-60 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLoading
                ? authMode === AuthMode.Login
                  ? "Logging in..."
                  : "Registering..."
                : authMode === AuthMode.Login
                ? "Login"
                : "Register"}
            </button>
          </form>
          <div className="text-center mt-4">
            {authMode === AuthMode.Login ? (
              <p>
                Don't have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setAuthMode(AuthMode.Register)}
                >
                  Register here
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setAuthMode(AuthMode.Login)}
                >
                  Login here
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
