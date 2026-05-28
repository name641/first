
import axios from "axios";

export const getErrorMessage = (
    error: unknown
): string => {

    if (axios.isAxiosError(error)) {

        // Laravel validation error
        if (
            error.response?.status === 422
        ) {

            const errors = error.response.data.errors as Record<string, string[]>; const firstError = Object.values(errors)[0]; return firstError[0];
        }

        // duplicate email
        if (
            error.response?.status === 409
        ) {

            return "このメールアドレスは既に使用されています";
        }

        return "登録に失敗しました";
    }

    return "通信エラーが発生しました";
};
