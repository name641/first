import {
    test,
    expect,
} from "@playwright/test";

test.describe(
    "Profile",
    () => {

        test.beforeEach(
            async ({ page }) => {

                // tokenセット
                await page.addInitScript(
                    () => {
                        localStorage.setItem(
                            "token",
                            "fake-token"
                        );
                    }
                );

                // me取得
                await page.route(
                    "**/*me",
                    async route => {

                        await route.fulfill({
                            status: 200,
                            contentType:
                                "application/json",

                            body: JSON.stringify({
                                id: 1,
                                name: "Test User",
                                email: "test@test.com"
                            })
                        });

                    }
                );

                // update API
                await page.route(
                    "**/*profile",
                    async route => {

                        const request =
                            route.request();

                        if (
                            request.method() ===
                            "PUT"
                        ) {

                            await route.fulfill({
                                status: 200,
                                contentType:
                                    "application/json",

                                body: JSON.stringify({
                                    success: true
                                })
                            });

                            return;
                        }

                        if (
                            request.method() ===
                            "DELETE"
                        ) {

                            await route.fulfill({
                                status: 200,
                                contentType:
                                    "application/json",

                                body: JSON.stringify({
                                    success: true
                                })
                            });

                            return;
                        }

                        await route.continue();

                    }
                );

                await page.goto(
                    "/profile"
                );

                await page.route(
                    "**/*tasks",
                    async route => {

                        await route.fulfill({
                            status: 200,
                            contentType:
                                "application/json",

                            body: JSON.stringify([
                                {
                                    id: 1,
                                    title: "Task A",
                                    description: "aaa",
                                    status: "todo"
                                }
                            ])
                        });

                    }
                );
            }
        );

        test(
            "プロフィール情報表示",
            async ({ page }) => {

                await expect(
                    page.getByRole(
                        "heading",
                        {
                            name: "Test User"
                        }
                    )
                ).toBeVisible();

                await expect(
                    page.getByTestId(
                        "name-input"
                    )
                ).toHaveValue(
                    "Test User"
                );

                await expect(
                    page.getByTestId(
                        "email-input"
                    )
                ).toHaveValue(
                    "test@test.com"
                );

            }
        );

        test(
            "プロフィール更新",
            async ({ page }) => {

                await page
                    .getByTestId(
                        "name-input"
                    )
                    .fill(
                        "New User"
                    );

                await page
                    .getByTestId(
                        "email-input"
                    )
                    .fill(
                        "new@test.com"
                    );

                await page
                    .getByTestId(
                        "password-input"
                    )
                    .fill(
                        "12345678"
                    );

                page.on(
                    "dialog",
                    async dialog => {
                        expect(
                            dialog.message()
                        ).toContain(
                            "更新しました"
                        );

                        await dialog.accept();
                    }
                );

                await page
                    .getByRole(
                        "button",
                        {
                            name: "Update"
                        }
                    )
                    .click();

            }
        );

        test(
            "アカウント削除",
            async ({ page }) => {

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "Delete Account"
                        }
                    )
                    .click();

                await expect(
                    page.getByText(
                        "DELETE を入力してください"
                    )
                ).toBeVisible();

                await page
                    .getByPlaceholder(
                        "DELETE"
                    )
                    .fill(
                        "DELETE"
                    );

                await page
                    .getByRole(
                        "button",
                        {
                            name:
                                "削除する"
                        }
                    )
                    .click();

                await expect(
                    page
                ).toHaveURL(
                    "/"
                );

            }
        );

        test(
            "DELETE入力前は削除できない",
            async ({ page }) => {

                await page
                    .getByRole(
                        "button",
                        {
                            name: "Delete Account"
                        }
                    )
                    .click();

                await expect(
                    page.getByRole(
                        "button",
                        {
                            name: "削除する"
                        }
                    )
                ).toBeDisabled();

            }
        );

        test(
            "DELETE以外では削除不可",
            async ({ page }) => {

                await page
                    .getByRole(
                        "button",
                        {
                            name: "Delete Account"
                        }
                    )
                    .click();

                await page
                    .getByPlaceholder(
                        "DELETE"
                    )
                    .fill(
                        "delete"
                    );

                await expect(
                    page.getByRole(
                        "button",
                        {
                            name: "削除する"
                        }
                    )
                ).toBeDisabled();

            }
        );

        test(
            "BackでTaskへ戻る",
            async ({ page }) => {

                await page
                    .getByRole(
                        "button",
                        {
                            name: "Back"
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
            "Logoutできる",
            async ({ page }) => {

                await page
                    .locator(
                        ".navbar-toggler"
                    )
                    .click();

                await page
                    .getByText(
                        "🚪 Logout"
                    )
                    .click();

                await expect(
                    page
                ).toHaveURL(
                    "/"
                );

            }
        );
    }
);