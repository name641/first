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
    id:1,
    title:"Task A",
    description:"aaa",
    status:"todo",
    deadline:"2026-05-26"
},
{
    id:2,
    title:"Task B",
    description:"bbb",
    status:"doing",
    deadline: new Date().toISOString()
},
{
    id:3,
    title:"Task C",
    description:"ccc",
    status:"done",
    deadline:"2026-05-30"
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

    test(
  "検索でタスク絞り込み",
  async ({ page }) => {

    await page
      .getByTestId(
        "search-input"
      )
      .fill(
        "Task B"
      );

    await expect(
      page.getByText(
        "Task B"
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        "Task A"
      )
    ).not.toBeVisible();

    await expect(
      page.getByText(
        "Task C"
      )
    ).not.toBeVisible();

  }
);

test(
  "期限フィルタ 今日",
  async ({ page }) => {

    await page
      .getByTestId(
        "deadline-filter"
      )
      .selectOption(
        "today"
      );

    await expect(
      page.getByText(
        "Task B"
      )
    ).toBeVisible();

  }
);

test(
  "Logoutできる",
  async ({ page }) => {

    await page
      .getByTestId(
        "menu-button"
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

test(
  "401時はログイン画面へ戻る",
  async ({ page }) => {

    await page.route(
      "**/*tasks",
      async route => {

        await route.fulfill({
          status:401,
          body:"{}"
        });

      }
    );

    await page.goto(
      "/functionlist"
    );

    await expect(
      page
    ).toHaveURL(
      "/"
    );

  }
);
});