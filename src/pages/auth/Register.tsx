import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation("register");

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("name")}</label>
          <input
            type="text"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder={t("name")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("email")}</label>
          <input
            type="email"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder={t("email")}
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
        {t("haveAccount")}{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          {t("login")}
        </a>
      </p>
    </div>
  );
};

export default Register;
