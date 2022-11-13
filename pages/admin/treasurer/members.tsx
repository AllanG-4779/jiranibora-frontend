
import MembersComponent from "../../../Components/admin/treasurer/MembersComponent";
import TreasurerLayout from "../../../Components/admin/treasurer/TreasurerLayout";

const MembersPage = () => {
  return (
    <>
      <MembersComponent />
    </>
  );
};
MembersPage.PageLayout = TreasurerLayout;
export default MembersPage;
