import {
    test,
    expect,
} from "@playwright/test";

test.describe(
    "Profile navigation",
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

                // tasks API
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
                                    status: "todo",
                                }
                            ])
                        });
                    }
                );

                // me API
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
                                email:
                                    "test@test.com"
                            })
                        });

                    }
                );

                await page.goto(
                    "/functionlist"
                );

                await expect(
                    page.getByText(
                        "Task A"
                    )
                ).toBeVisible();

            }
        );

        test(
            "ユーザー名クリックでProfileへ遷移",
            async ({ page }) => {

                await page
                    .getByText(
                        "Test User"
                    )
                    .click();

                await expect(
                    page
                ).toHaveURL(
                    /profile/
                );

            }
        );

        test(
            "サイドバーからProfileへ遷移",
            async ({ page }) => {

                await page
                    .locator(
                        ".navbar-toggler"
                    )
                    .click();

                await page
                    .getByText(
                        "👤 Profile"
                    )
                    .click();

                await expect(
                    page
                ).toHaveURL(
                    /profile/
                );

            }
        );

    }
);