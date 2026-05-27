import {
  test,
  expect,
} from "@playwright/test";

test.describe(
  "Register",
  () => {

    test.beforeEach(
      async ({ page }) => {

        await page.goto(
          "/create"
        );
      }
    );

    test(
      "名前未入力",
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
            "password-input"
          )
          .fill(
            "password123"
          );

        await page
          .getByTestId(
            "register-button"
          )
          .click();

        await expect(
          page
            .getByTestId(
              "name-input"
            )
        ).toBeFocused();

      }
    );

    test(
      "パスワード8文字未満",
      async ({
        page,
      }) => {

        await page
          .getByTestId(
            "name-input"
          )
          .fill(
            "Test User"
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
            "123"
          );

        await page
          .getByTestId(
            "register-button"
          )
          .click();

        await expect(
          page
            .getByTestId(
              "password-input"
            )
        ).toBeFocused();

      }
    );

    test(
      "登録成功",
      async ({
        page,
      }) => {

        await page.route(
          "**/*users",
          async (
            route
          ) => {

            await route.fulfill(
              {
                status: 201,
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
            "name-input"
          )
          .fill(
            "Test User"
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

        await page
          .getByTestId(
            "register-button"
          )
          .click();

        await expect(
          page.getByTestId(
            "message"
          )
        ).toContainText(
          "登録成功！"
        );

        await page.waitForURL(
          "**/"
        );

        await expect(
          page
        ).toHaveURL(
          "/"
        );

      }
    );

    test(
      "メール重複",
      async ({
        page,
      }) => {

        await page.route(
          "**/*users",
          async (
            route
          ) => {

            await route.fulfill(
              {
                status:409,
                contentType:
                  "application/json",

                body:
                  JSON.stringify(
                    {}
                  )
              }
            );

          }
        );

        await page
          .getByTestId(
            "name-input"
          )
          .fill(
            "Test User"
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

        await page
          .getByTestId(
            "register-button"
          )
          .click();

        await expect(
          page.getByTestId(
            "message"
          )
        ).toContainText(
          "このメールアドレスは既に使用されています"
        );

      }
    );

  }
);