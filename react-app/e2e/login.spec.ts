import {
  test,
  expect,
} from "@playwright/test";

test.describe(
  "Login",
  () => {
    test.beforeEach(
      async ({
        page,
      }) => {
        await page.goto(
          "/",
          {
            waitUntil:
              "domcontentloaded",
          }
        );
      }
    );

    test(
      "メール未入力エラー",
      async ({
        page,
      }) => {
        await page
          .getByTestId(
            "login-button"
          )
          .click();

        await expect(
          page.getByTestId(
            "error-message"
          )
        ).toContainText(
          "メールアドレスを入力してください"
        );
      }
    );

    test(
      "パスワード未入力エラー",
      async ({
        page,
      }) => {
        await page
          .getByTestId(
            "email-input"
          )
          .fill(
            "test@example.com"
          );

        await page
          .getByTestId(
            "login-button"
          )
          .click();

        await expect(
          page.getByTestId(
            "error-message"
          )
        ).toContainText(
          "パスワードを入力してください"
        );
      }
    );

    test(
      "パスワード表示切替",
      async ({
        page,
      }) => {
        const input =
          page.getByTestId(
            "password-input"
          );

        await expect(
          input
        ).toHaveAttribute(
          "type",
          "password"
        );

        await page
          .getByRole(
            "button",
            {
              name:
                "パスワードを表示",
            }
          )
          .click();

        await expect(
          input
        ).toHaveAttribute(
          "type",
          "text"
        );

        await page
          .getByRole(
            "button",
            {
              name:
                "パスワードを隠す",
            }
          )
          .click();

        await expect(
          input
        ).toHaveAttribute(
          "type",
          "password"
        );
      }
    );

    test(
      "ログイン成功",
      async ({
        page,
      }) => {

        // APIモック
        await page.route(
          "**/*login",
          async (
            route
          ) => {
            await route.fulfill(
              {
                status: 200,
                contentType:
                  "application/json",
                body:
                  JSON.stringify(
                    {
                      token:
                        "fake-token",

                      user: {
                        id: 1,
                        name:
                          "Test User",
                        email:
                          "test@example.com",
                      },
                    }
                  ),
              }
            );
          }
        );

        await page
          .getByTestId(
            "email-input"
          )
          .fill(
            "test@example.com"
          );

        await page
          .getByTestId(
            "password-input"
          )
          .fill(
            "password123"
          );

        await Promise.all(
          [
            page.waitForURL(
              "**/functionlist"
            ),

            page
              .getByTestId(
                "login-button"
              )
              .click(),
          ]
        );

        await expect(
          page
        ).toHaveURL(
          /functionlist/
        );

        const token =
          await page.evaluate(
            () =>
              localStorage.getItem(
                "token"
              )
          );

        expect(
          token
        ).toBe(
          "fake-token"
        );

        const user =
          await page.evaluate(
            () =>
              localStorage.getItem(
                "user"
              )
          );

        expect(
          JSON.parse(
            user!
          ).email
        ).toBe(
          "test@example.com"
        );
      }
    );

    test(
      "ログイン失敗(401)",
      async ({
        page,
      }) => {

        await page.route(
          "**/*login",
          async (
            route
          ) => {
            await route.fulfill(
              {
                status: 401,
                contentType:
                  "application/json",
                body:
                  JSON.stringify(
                    {}
                  ),
              }
            );
          }
        );

        await page
          .getByTestId(
            "email-input"
          )
          .fill(
            "wrong@test.com"
          );

        await page
          .getByTestId(
            "password-input"
          )
          .fill(
            "wrongpass"
          );

        await page
          .getByTestId(
            "login-button"
          )
          .click();

        await expect(
          page.getByTestId(
            "error-message"
          )
        ).toContainText(
          "メールアドレスまたはパスワードが間違っています"
        );
      }
    );
  }
);