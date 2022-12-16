import { NextPage } from "next";
import { taskService } from "@/services/task.service";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

const CreateTaskPage: NextPage = () => {
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!session?.user) return;
          
          setLoading(true);
          await taskService.withToken(session?.user.access_token).create(title);
          setLoading(false);
        }}
      >
        <label
          className="block uppercase text-xs font-semibold tracking-wider"
          htmlFor="title"
        >
          Title
        </label>
        <input
          className="p-3 rounded"
          id="title"
          type="text"
          placeholder="for example, blah"
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
          disabled={title.length === 0 || loading}
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskPage;
