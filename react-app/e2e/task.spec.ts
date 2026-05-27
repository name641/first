import {
    test,
    expect,
} from "@playwright/test";

test.describe("FunctionList", () => {

    test.beforeEach(async ({ page }) => {

        // ページ読み込み前にtoken設定
        await page.addInitScript(() => {
            localStorage.setItem(
                "token",
                "fake-token"
            );
        });

        // tasks API
        await page.route(
            "**/*tasks",
            async route => {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify([
                        {
                            id: 1,
                            title: "Task A",
                            description: "aaa",
                            status: "todo",
                        },
                        {
                            id: 2,
                            title: "Task B",
                            description: "bbb",
                            status: "doing",
                        },
                        {
                            id: 3,
                            title: "Task C",
                            description: "ccc",
                            status: "done",
                        }
                    ])
                });
            }
        );
        // await page.route(
        //     "**/api/tasks",
        //     async route => {
        //         await route.fulfill({
        //             status: 200,
        //             contentType: "application/json",
        //             body: JSON.stringify([
        //                 {
        //                     id: 1,
        //                     title: "Task A",
        //                     description: "aaa",
        //                     status: "todo",
        //                 },
        //                 {
        //                     id: 2,
        //                     title: "Task B",
        //                     description: "bbb",
        //                     status: "doing",
        //                 },
        //                 {
        //                     id: 3,
        //                     title: "Task C",
        //                     description: "ccc",
        //                     status: "done",
        //                 }
        //             ])
        //         });
        //     }
        // );

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
                        name: "Test User"
                    })
                });
            }
        );

        // task詳細API
        await page.route(
            "**/api/tasks/1",
            async route => {

                await route.fulfill({
                    status: 200,
                    contentType:
                        "application/json",

                    body: JSON.stringify({
                        id: 1,
                        title: "Task A",
                        description: "aaa",
                        status: "todo"
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
    });

    test("タスク一覧表示", async ({ page }) => {

        await expect(
            page.getByText("Task A")
        ).toBeVisible();

    });
    test(
        "タスク編集画面へ遷移",
        async ({ page }) => {

            await page
                .getByRole(
                    "heading",
                    {
                        name: "Task A"
                    }
                )
                .click();

            await expect(
                page
            ).toHaveURL(
                /taskedit\/1/
            );

        }
    );


    test(
        "新規作成画面へ遷移",
        async ({ page }) => {

            await page
                .getByRole(
                    "button",
                    {
                        name: /\+ New Task/
                    }
                )
                .click();

            await expect(
                page
            ).toHaveURL(
                /taskscreate/
            );

        }
    );

    // test(
    //     "ログアウト",
    //     async ({ page }) => {

    //         await page
    //             .locator(
    //                 ".navbar-toggler"
    //             )
    //             .click();

    //         await page
    //             .getByTestId(
    //                 "🚪 Logout"
    //             )
    //             .click();

    //         await expect(
    //             page
    //         ).toHaveURL(
    //             /\//
    //         );

    //         const token =
    //             await page.evaluate(
    //                 () =>
    //                     localStorage.getItem(
    //                         "token"
    //                     )
    //             );

    //         expect(
    //             token
    //         ).toBeNull();

    //     }
    // );
});