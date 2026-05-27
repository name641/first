import {
    test,
    expect,
} from "@playwright/test";

test.describe(
    "TaskEdit",
    () => {

        test.beforeEach(
            async ({ page }) => {

                await page.addInitScript(
                    () => {
                        localStorage.setItem(
                            "token",
                            "fake-token"
                        );
                    }
                );

                // user API
                await page.route(
                    "**/*me",
                    async route => {

                        await route.fulfill({
                            status: 200,
                            contentType:
                                "application/json",

                            body: JSON.stringify({
                                name:
                                    "Test User"
                            })
                        });

                    }
                );

                // task詳細
                await page.route(
                    "**/*tasks/1",
                    async route => {

                        await route.fulfill({
                            status: 200,
                            contentType:
                                "application/json",

                            body: JSON.stringify({
                                id: 1,
                                title: "Task A",
                                description: "aaa",
                                deadline:
                                    "2026-06-01",
                                status:
                                    "todo"
                            })
                        });

                    }
                );

                await page.goto(
                    "/taskedit/1"
                );

            }
        );
        test(
            "編集画面表示",
            async ({ page }) => {

                await expect(
                    page.getByPlaceholder(
                        "Title"
                    )
                ).toHaveValue(
                    "Task A"
                );

                await expect(
                    page.getByPlaceholder(
                        "Description"
                    )
                ).toHaveValue(
                    "aaa"
                );

            }
        );

        test(
            "タスク更新",
            async ({ page }) => {

                await page.route(
                    "**/*tasks/1",
                    async route => {

                        const method =
                            route.request()
                                .method();

                        // 編集画面表示用
                        if (
                            method === "GET"
                        ) {

                            await route.fulfill({
                                status: 200,
                                contentType:
                                    "application/json",

                                body:
                                    JSON.stringify({
                                        id: 1,
                                        title: "Task A",
                                        description: "aaa",
                                        deadline:
                                            "2026-06-01",
                                        status:
                                            "todo"
                                    })
                            });

                        }

                        // 更新用
                        if (
                            method === "PUT"
                        ) {

                            await route.fulfill({
                                status: 200,
                                contentType:
                                    "application/json",

                                body:
                                    JSON.stringify({
                                        success: true
                                    })
                            });

                        }

                    }
                );

                await expect(
                    page.getByPlaceholder(
                        "Title"
                    )
                ).toBeVisible();

                await page
                    .getByPlaceholder(
                        "Title"
                    )
                    .fill(
                        "New Task"
                    );

                await page
                    .getByPlaceholder(
                        "Description"
                    )
                    .fill(
                        "updated"
                    );

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Update"
                        }
                    )
                    .click();

                await expect(
                    page
                ).toHaveURL(
                    /functionlist/
                );

            }
        );

        test(
            "削除モーダル表示",
            async ({ page }) => {

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Delete"
                        }
                    )
                    .click();

                await expect(
                    page.getByText(
                        "⚠ タスク削除"
                    )
                )
                    .toBeVisible();

                await expect(
                    page.getByPlaceholder(
                        "DELETE"
                    )
                )
                    .toBeVisible();

            }
        );
        test(
            "DELETE入力で削除可能になる",
            async ({ page }) => {

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Delete"
                        }
                    )
                    .click();

                const deleteButton =
                    page.getByRole(
                        "button",
                        {
                            name:
                                "削除"
                        }
                    );

                // 初期は無効
                await expect(
                    deleteButton
                )
                    .toBeDisabled();

                await page
                    .getByPlaceholder(
                        "DELETE"
                    )
                    .fill(
                        "DELETE"
                    );

                await expect(
                    deleteButton
                )
                    .toBeEnabled();

            }
        );

        test(
            "タスク削除",
            async ({ page }) => {

                await page.route(
                    "**/*tasks/1",
                    async route => {

                        const method =
                            route.request()
                                .method();

                        // 編集画面表示
                        if (
                            method === "GET"
                        ) {

                            await route.fulfill({
                                status: 200,
                                contentType:
                                    "application/json",

                                body:
                                    JSON.stringify({
                                        id: 1,
                                        title: "Task A",
                                        description: "aaa",
                                        deadline:
                                            "2026-06-01",
                                        status:
                                            "todo"
                                    })
                            });

                        }

                        // 削除API
                        if (
                            method === "DELETE"
                        ) {

                            await route.fulfill({
                                status: 200,
                                contentType:
                                    "application/json",

                                body:
                                    JSON.stringify({
                                        success: true
                                    })
                            });

                        }

                    }
                );

                // モーダル開く
                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Delete"
                        }
                    )
                    .click();

                // DELETE入力
                await page
                    .getByPlaceholder(
                        "DELETE"
                    )
                    .fill(
                        "DELETE"
                    );

                // 削除
                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "削除"
                        }
                    )
                    .click();

                // 一覧へ戻る
                await expect(
                    page
                ).toHaveURL(
                    /functionlist/
                );

            }
        );
    }
);