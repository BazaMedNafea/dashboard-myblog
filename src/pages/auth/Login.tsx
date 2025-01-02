import { useState } from "react";
import { useTranslation } from "react-i18next";
import { login } from "../../services/auth"; // Import the login API service

const Login = () => {
  const { t } = useTranslation("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      console.log("Login successful:", response);
      // Redirect to dashboard or homepage
    } catch (err) {
      setError(t("loginError"));
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">{t("email")}</label>
          <input
            type="email"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("password")}
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("submit")}
        </button>
      </form>
      <p className="mt-4 text-center">
        {t("noAccount")}{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          {t("register")}
        </a>
      </p>
    </div>
  );
};

export default Login;
