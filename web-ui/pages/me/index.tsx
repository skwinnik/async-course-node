import TaskList from "@/components/task/taskList/taskList";
import TransactionList from "@/components/transaction/transactionList/transactionList";
import { viewService } from "@/services/view.service";
import { MeView } from "@/types/view/me.view";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

interface IModel {
  me: MeView;
}
const Me: NextPage<IModel> = ({ me }) => {
  return (
    <div className="flex">
      <div className="flex-1">
        <TaskList tasks={me.tasks_preview} viewOnly={true} />
      </div>
      <div className="flex-1">
        <TransactionList transactions={me.transactions_preview} />
      </div>
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

  const me = await viewService
    .withToken(session.user.access_token)
    .getMeView(session.user.id);

  return {
    props: {
      session,
      me,
    },
  };
};
