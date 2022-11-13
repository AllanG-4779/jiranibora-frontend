import LoanComponent from "../../../../Components/admin/treasurer/LoanComponent";
import TreasurerLayout from "../../../../Components/admin/treasurer/TreasurerLayout";

const LoanPage = () => {
  return (
    <>
      <LoanComponent />
    </>
  );
};
LoanPage.PageLayout = TreasurerLayout;
export default LoanPage;
