import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { authService } from "@/services/auth.service";
import { useEffect, useState } from "react";

const Me: NextPage = () => {
  const { data } = useSession();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (!data) return;
    authService.setToken(data.user.access_token);
    authService.me().then((r) => setUser(r.data));
  }, [data]);

  return (
    <div>
      <h1>Me</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
export default Me;
