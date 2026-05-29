import axios from "axios";

import {
  getErrorMessage,
} from "./getErrorMessage";

export const getLoginErrorMessage = (
  error: unknown
): string => {

  if (axios.isAxiosError(error)) {

    if (
      error.response?.status === 401
    ) {

      return "メールアドレスまたはパスワードが間違っています";
    }
  }

  return getErrorMessage(error);
};