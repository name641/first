import {
    getErrorMessage,
} from "./getErrorMessage";

export const getTaskEditErrorMessage = (
    type:
        | "fetch"
        | "update"
        | "delete",
    error?: unknown
): string => {

    switch (type) {

        case "fetch":
            return "取得失敗";

        case "update":
            return "更新失敗";

        case "delete":
            return "削除失敗";

        default:

            if (error) {
                return getErrorMessage(error);
            }

            return "エラーが発生しました";
    }
};