import SecretaryDashboard from "../../../Components/admin/secretary/SecretaryDashboard";
import SecretaryLayout from "../../../Components/admin/secretary/SecretaryLayout";

const TreasurerHome = () => {
  return (
    <>
      <SecretaryDashboard />
    </>
  );
};
TreasurerHome.PageLayout = SecretaryLayout;
export default TreasurerHome;
