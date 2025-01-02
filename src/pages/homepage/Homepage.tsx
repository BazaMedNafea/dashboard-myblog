import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Homepage = () => {
  const { t } = useTranslation("homepage");
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          {t("welcome")}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t("description")}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("additionalText")}
        </p>
        <button
          onClick={handleLoginRedirect}
          className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto"
        >
          <span>{t("loginButton")}</span>
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Homepage;
