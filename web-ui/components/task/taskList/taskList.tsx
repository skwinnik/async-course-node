import { taskService } from "@/services/task.service";
import { TaskDto } from "@/types/task/task.dto";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface IModel {
  tasks: TaskDto[];
}
const TaskList: NextPage<IModel> = (model) => {
  const { data: session, status } = useSession();

  const [tasks, setTasks] = useState<TaskDto[]>(model.tasks);
  const onComplete = async (task: TaskDto) => {
    if (status !== "authenticated") return;

    await taskService.withToken(session.user.access_token).complete(task.id);
    const newTasks = [...tasks];
    newTasks.find((x) => x.id === task.id)!.status = "COMPLETED";
    setTasks(newTasks);
  };
  return (
    <div>
      <div className="flex flex-col gap-5 w-full">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-row w-full p-3 border rounded border-neutral-600"
          >
            <div className="flex-1">{task.name}</div>
            <div className="flex-1">{task.status}</div>
            <div className="flex-auto grow-0 shrink-0 w-36">
              {task.status === "ASSIGNED" && (
                <button
                  onClick={() => onComplete(task)}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Complete
                </button>
              )}
              {task.status === "COMPLETED" && (
                <button
                  disabled
                  className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TaskList;
