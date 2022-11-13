import MemberLayout from "../../Components/client/member/MemberLayout";
import Transaction from "../../Components/client/member/Transaction";

const TransactionPage = () => {
  return (
    <>
      <Transaction />
    </>
  );
};
TransactionPage.PageLayout = MemberLayout;
export default TransactionPage;
