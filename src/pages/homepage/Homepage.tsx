import { useTranslation } from "react-i18next";

const Homepage = () => {
  const { t } = useTranslation("homepage");

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{t("welcome")}</h1>
      <p>{t("description")}</p>
    </div>
  );
};

export default Homepage;
