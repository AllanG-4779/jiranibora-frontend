import MeetingComponent from "../../../Components/admin/secretary/MeetingComponent";
import SecretaryLayout from "../../../Components/admin/secretary/SecretaryLayout";

const MeetingPage = () => {
  return (
    <>
      <MeetingComponent />
    </>
  );
};
MeetingPage.PageLayout = SecretaryLayout;
export default MeetingPage;
