import {
    test,
    expect,
} from "@playwright/test";

test.describe(
    "TaskCreate",
    () => {

        test.beforeEach(
            async ({ page }) => {

                // token
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

                            body:
                                JSON.stringify({
                                    name:
                                        "Test User"
                                })
                        });

                    }
                );

                await page.goto(
                    "/taskscreate"
                );

            }
        );

        test(
            "作成画面表示",
            async ({ page }) => {

                await expect(
                    page.getByPlaceholder(
                        "Title"
                    )
                ).toBeVisible();

                await expect(
                    page.getByPlaceholder(
                        "Description"
                    )
                ).toBeVisible();

            }
        );

        test(
            "タスク作成",
            async ({ page }) => {

                await page.route(
                    "**/*tasks",
                    async route => {

                        if (
                            route.request()
                                .method() ===
                            "POST"
                        ) {

                            await route.fulfill({
                                status: 201,
                                contentType:
                                    "application/json",

                                body:
                                    JSON.stringify({
                                        id: 1
                                    })
                            });

                        }

                    }
                );

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
                        "sample"
                    );

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Create"
                        }
                    )
                    .click();

                await expect(
                    page
                )
                    .toHaveURL(
                        /functionlist/
                    );

            }
        );

        test(
            "Backで一覧へ戻る",
            async ({ page }) => {

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Back"
                        }
                    )
                    .click();

                await expect(
                    page
                )
                    .toHaveURL(
                        /functionlist/
                    );

            }
        );

        test(
            "Title未入力では作成できない",
            async ({ page }) => {

                await page
                    .getByPlaceholder(
                        "Description"
                    )
                    .fill(
                        "sample"
                    );

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Create"
                        }
                    )
                    .click();

                await expect(
                    page
                )
                    .toHaveURL(
                        /taskscreate/
                    );

            }
        );

        test(
            "Description未入力では作成できない",
            async ({ page }) => {

                await page
                    .getByPlaceholder(
                        "Title"
                    )
                    .fill(
                        "New Task"
                    );

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Create"
                        }
                    )
                    .click();

                await expect(
                    page
                )
                    .toHaveURL(
                        /taskscreate/
                    );

            }
        );
    }
);