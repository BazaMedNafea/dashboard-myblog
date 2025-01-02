import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";
import SideMenu from "./SideMenu";

const Navbar = () => {
  const { t, i18n } = useTranslation("common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-blue-500 dark:bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <div className={i18n.language === "ar" ? "mr-4" : "ml-4"}>
            <div className="text-white text-xl font-bold">My App</div>
          </div>
        </div>

        <div className="flex items-center">
          <ul
            className={`hidden lg:flex items-center ${
              i18n.language === "ar" ? "space-x-reverse" : ""
            } space-x-4`}
          >
            <li>
              <Link
                to="/"
                className="text-white hover:text-gray-200 dark:hover:text-gray-400"
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-white hover:text-gray-200 dark:hover:text-gray-400"
              >
                {t("about")}
              </Link>
            </li>
          </ul>

          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md ml-4"
          >
            {t("logout")}
          </button>
        </div>
      </div>

      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} logout={handleLogout} />
    </nav>
  );
};

export default Navbar;
