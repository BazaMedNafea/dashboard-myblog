import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";

const Navbar = () => {
  const { t, i18n } = useTranslation("common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-500 dark:bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Hamburger Menu */}
        <div className="flex items-center">
          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          {/* Add conditional spacing based on language */}
          <div
            className={
              i18n.language === "ar" ? "mr-4" : "ml-4" // Use mr-4 for Arabic, ml-4 for English
            }
          >
            {/* Logo or Brand Name */}
            <div className="text-white text-xl font-bold">My App</div>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <ul
          className={`hidden lg:flex ${
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
      </div>

      {/* Side Menu (Mobile) */}
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </nav>
  );
};

export default Navbar;
