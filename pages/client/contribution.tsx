import Contribution from "../../Components/client/member/Contribution";
import MemberLayout from "../../Components/client/member/MemberLayout";

const ContributionPage = () => {
  return (
    <>
      <Contribution />
    </>
  );
};
ContributionPage.PageLayout = MemberLayout;
export default ContributionPage;
