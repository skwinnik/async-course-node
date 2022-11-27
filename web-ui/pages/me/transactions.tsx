import TransactionList from "@/components/transaction/transactionList/transactionList";
import { accountingService } from "@/services/accounting.service";
import { TransactionDto } from "@/types/accounting/transaction.dto";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
interface IModel {
  transactions: TransactionDto[];
}

const Transactions: NextPage<IModel> = ({ transactions }) => {
  return (
    <div>
      <h1 className="text-3xl mb-3">Transactions</h1>
      <TransactionList transactions={transactions} />
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

  const transactions = await accountingService
    .withToken(session.user.access_token)
    .getTransactions(session.user.id);

  return {
    props: {
      session,
      transactions,
    },
  };
};
