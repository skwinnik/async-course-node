import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
interface IModel {}

const Transactions: NextPage<IModel> = ({}) => {
  return (
    <div>
      <h1 className="text-3xl mb-3">Transactions</h1>
    </div>
  );
};
export default Transactions;

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

  return {
    props: {
      session,
    },
  };
};
