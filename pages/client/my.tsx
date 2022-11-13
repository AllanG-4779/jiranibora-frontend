import ClientDashboard from "../../Components/client/member/Homepage";
import MemberLayout from "../../Components/client/member/MemberLayout";

const Mypage = () => {
  return (
    <>
      <ClientDashboard />
    </>
  );
};

Mypage.PageLayout = MemberLayout;
export default Mypage;
