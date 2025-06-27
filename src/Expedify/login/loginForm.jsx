import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "./userSlice";
import {
  UserIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [type, setType] = useState("personal");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          type,
          rememberMe,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMsg("Email ou mot de passe incorrect.");
        } else {
          setErrorMsg("Erreur serveur. Veuillez réessayer.");
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const { user, token } = data;

      dispatch(setUser({ user, token, type }));
      setSuccessMessage("Connexion réussie ! Redirection en cours...");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Redirection après un court délai
      setTimeout(() => {
        if (email === "marwaabicha@gmail.com") {
          navigate("/admin-dashboard");
        } else {
          navigate(type === "personal" ? "/" : "/company-dashboard");
        }
      }, 2500);
    } catch (error) {
      console.error(error);
      setErrorMsg("Aucune réponse du serveur. Vérifiez votre connexion.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <h2 className="text-3xl font-bold text-center relative">
              Connexion
            </h2>
            <p className="text-indigo-100 text-center mt-2 relative">
              Content de vous revoir !
            </p>
          </div>

          <div className="p-8">
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-red-50/80 text-red-700 rounded-lg text-center font-medium mb-4">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-between space-x-4 mb-8 bg-indigo-50/50 p-1.5 rounded-xl backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setType("personal")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  type === "personal"
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <UserIcon className="w-5 h-5" />
                Particulier
              </button>

              <button
                type="button"
                onClick={() => setType("company")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  type === "company"
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <BuildingOffice2Icon className="w-5 h-5" />
                Entreprise
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400/80">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400/80">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  required
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Se souvenir de moi</span>
                </label>

                <Link
                  to="/forgotPassword"
                  className="text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>

              <Link
                to="/signUp"
                className="block text-center mx-auto text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none"
              >
                Vous n'avez pas un compte?
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;