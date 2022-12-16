import { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Header: NextPage = () => {
  const { status: sessionStatus, data: sessionData } = useSession();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<IMenuItem[] | undefined>(
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (!sessionData || !sessionData.user) return;
    setMenuItems(getMenuItems(sessionData.user.role));
  }, [sessionData]);

  const linkClasses =
    "block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
  const linkActiveClasses =
    "block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white";

  return (
    <nav className="bg-white border-gray-200 rounded dark:bg-black">
      <div className="container flex flex-wrap items-center justify-between mx-auto px-5 py-2 md:py-0">
        <Link href={"/"} className="flex items-center">
          Logo
        </Link>
        <button
          onClick={() => setMenuVisible(!menuVisible)}
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className={`${menuVisible ? "" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:items-center md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-black md:dark:bg-black dark:border-gray-700">
            {menuItems &&
              menuItems.map((item, i) => (
                <li key={i} className="order-1">
                  <Link
                    href={item.href}
                    className={` ${
                      router.pathname === item.href
                        ? linkActiveClasses
                        : linkClasses
                    }`}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}

            <li className="-order-1 md:order-1">
              {sessionStatus === "loading" && "Loading!"}
              {sessionStatus === "unauthenticated" && (
                <div className="flex-1 gap-5 pb-5 md:pb-0 items-center justify-between text-center">
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
              {sessionStatus === "authenticated" &&
                sessionData &&
                sessionData.user &&
                sessionData.user.name && (
                  <div className="flex gap-5 pb-5 md:pb-0 items-center justify-between">
                    <div className="flex-auto">
                      Hello, {sessionData.user.name}!
                    </div>
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
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Header;

interface IMenuItem {
  text: string;
  href: string;
}

function getMenuItems(role: string) {
  switch (role) {
    case "admin":
      return adminMenuItems;
    case "user":
      return userMenuItems;
    default:
      return [];
  }
}

const userMenuItems: IMenuItem[] = [
  {
    text: "Home",
    href: "/me",
  },
  {
    text: "Tasks",
    href: "/me/tasks",
  },
  {
    text: "Transactions",
    href: "/me/transactions",
  },
];

const adminMenuItems: IMenuItem[] = [
  {
    text: "Home",
    href: "/admin",
  },
  {
    text: "Create Task",
    href: "/admin/tasks/create",
  }
];
