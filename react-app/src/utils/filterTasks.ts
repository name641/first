//計算だけ　Utils関数
import type {
  Task,
} from "../types/task";

export function filterTasks(
  tasks: Task[],
  search: string,
  deadlineFilter: string
) {

  return tasks.filter(
    (task) => {

      const matchSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        task.description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      if (!matchSearch)
        return false;

      if (
        deadlineFilter ===
        "all"
      )
        return true;

      if (!task.deadline)
        return false;

      const today =
        new Date();

      const d =
        new Date(
          task.deadline
        );

      today.setHours(
        0,
        0,
        0,
        0
      );

      d.setHours(
        0,
        0,
        0,
        0
      );

      const diff =
        Math.ceil(
          (
            d.getTime() -
            today.getTime()
          ) /
          (
            1000 *
            60 *
            60 *
            24
          )
        );

      if (
        deadlineFilter ===
        "overdue"
      )
        return diff < 0;

      if (
        deadlineFilter ===
        "today"
      )
        return diff === 0;

      if (
        deadlineFilter ===
        "future"
      )
        return diff > 0;

      return true;
    }
  );
}