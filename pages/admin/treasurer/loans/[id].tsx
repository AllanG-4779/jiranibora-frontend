import LoanApplicationComponent from "../../../../Components/admin/treasurer/LoanApplicationComponent";
import TreasurerLayout from "../../../../Components/admin/treasurer/TreasurerLayout";

const LoanApplicationPage = () => {
  return (
    <>
      <LoanApplicationComponent />
    </>
  );
};
LoanApplicationPage.PageLayout = TreasurerLayout;
export default LoanApplicationPage;
