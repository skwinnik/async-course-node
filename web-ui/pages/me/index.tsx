import TaskList from "@/components/task/taskList/taskList";
import { taskService } from "@/services/task.service";
import { TaskDto } from "@/types/task/task.dto";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
interface IModel {
  tasks: TaskDto[];
}

const Me: NextPage<IModel> = ({ tasks }) => {
  return (
    <div>
      <h1 className="text-3xl mb-3">Tasks</h1>
      <TaskList tasks={tasks} />
    </div>
  );
};
export default Me;

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

  const tasks = await taskService
    .withToken(session.user.access_token)
    .getAll(session.user.id);

  return {
    props: {
      session,
      tasks,
    },
  };
};
