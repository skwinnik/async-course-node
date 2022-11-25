import { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

const Header: NextPage = () => {
  const { status, data } = useSession();
  return (
    <div className="container mx-auto w-full p-5 flex items-center justify-between">
      <div className="text-3xl">Logo</div>
      <div className="flex-1 text-right">
        {status === "loading" && "Loading!"}
        {status === "unauthenticated" && (
          <div className="flex gap-5 items-center justify-between">
            <div className="flex-auto flex-grow-0 flex-shrink-0">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => signIn()}
              >
                Login
              </button>
            </div>
          </div>
        )}
        {status === "authenticated" && data && data.user && data.user.name && (
          <div className="flex gap-5 items-center justify-between">
            <div className="flex-auto">Hello, {data.user.name}!</div>
            <div className="flex-auto flex-grow-0 flex-shrink-0">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Header;
