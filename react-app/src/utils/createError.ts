import axios from "axios";

import {
    getErrorMessage,
} from "./getErrorMessage";

export const getCreateErrorMessage = (
    error: unknown
): string => {

    if (axios.isAxiosError(error)) {

        switch (
        error.response?.status
        ) {

            case 409:
                return "このメールアドレスは既に使用されています";

            case 422:

                const data =
                    error.response.data as {
                        errors:
                        Record<string, string[]>;
                    };

                const firstError =
                    Object.values(
                        data.errors
                    )[0];

                return firstError[0];
        }
    }

    return getErrorMessage(error);
};