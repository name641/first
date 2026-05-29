import axios from "axios";

export const getErrorMessage = (
  error: unknown
): string => {

  if (axios.isAxiosError(error)) {

    switch (
      error.response?.status
    ) {

      case 500:
        return "サーバーエラーが発生しました";

      default:
        return "通信エラーが発生しました";
    }
  }

  return "予期しないエラーが発生しました";
};