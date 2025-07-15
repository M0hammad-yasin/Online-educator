import ClassForm from "../../module/classes/components/ClassForm";
import ClassList from "../../module/classes/components/ClassList";

const ClassPage: React.FC = () => {
  return (
    <div>
      <ClassList />
      <ClassForm />
    </div>
  );
};
export default ClassPage;