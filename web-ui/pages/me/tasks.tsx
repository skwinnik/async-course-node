import TaskList from "@/components/task/taskList/taskList";
import { viewService } from "@/services/view.service";
import { TaskDto } from "@/types/task/task.dto";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
interface IModel {
  tasks: TaskDto[];
}

const Tasks: NextPage<IModel> = ({ tasks }) => {
  return (
    <div>
      <h1 className="text-3xl mb-3">Tasks</h1>
      <TaskList tasks={tasks} />
    </div>
  );
};
export default Tasks;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const tasks = await viewService
    .withToken(session.user.access_token)
    .getTasks({
      userId: session.user.id,
      offset: 0,
      limit: 10,
      sort: { by: "id", order: "desc" },
    });

  return {
    props: {
      session,
      tasks: tasks.data,
    },
  };
};
