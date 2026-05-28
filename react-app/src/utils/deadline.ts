export const getDeadlineColor = (
    deadline?: string | null
  ) => {
    if (!deadline)
      return "#6c757d";

    const today =
      new Date();

    const d = new Date(
      deadline
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

    if (d < today)
      return "#dc3545";

    if (
      d.getTime() ===
      today.getTime()
    )
      return "#ffc107";

    return "#198754";
  };

export  const getRemainingDays = (
    deadline?: string | null
  ) => {
    if (!deadline)
      return null;

    const today =
      new Date();

    const d = new Date(
      deadline
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
        (d.getTime() -
          today.getTime()) /
        (1000 *
          60 *
          60 *
          24)
      );

    if (diff < 0)
      return "期限切れ";

    if (diff === 0)
      return "今日";

    return `あと${diff}日`;
};
