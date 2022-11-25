import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { authService } from "@/services/auth.service";
import { useEffect, useState } from "react";

const Me: NextPage = () => {
  return (
    <div>
      <h1>Me</h1>
    </div>
  );
};
export default Me;
