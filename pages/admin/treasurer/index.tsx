import TreasurerDashboard from "../../../Components/admin/treasurer/TreasurerDashboard";
import TreasurerLayout from "../../../Components/admin/treasurer/TreasurerLayout";

const TreasurerHome = () => {
  return (
    <>
    <TreasurerDashboard/>
    </>
  );
};

TreasurerHome.PageLayout = TreasurerLayout;

export default TreasurerHome;
