// import {
//     test,
//     expect,
// } from "@playwright/test";

// test.describe(
//     "Profile",
//     () => {

//         test.beforeEach(
//             async ({ page }) => {

//                 // token設定
//                 await page.addInitScript(() => {
//                     localStorage.setItem(
//                         "token",
//                         "fake-token"
//                     );
//                 });

//                 // me取得
//                 await page.route(
//                     "**/*me",
//                     async route => {

//                         await route.fulfill({
//                             status: 200,
//                             contentType:
//                                 "application/json",

//                             body: JSON.stringify({
//                                 id: 1,
//                                 name: "Test User",
//                                 email: "test@test.com"
//                             })
//                         });

//                     }
//                 );

//                 // profile更新/削除
//                 await page.route(
//                     "**/*profile",
//                     async route => {

//                         if (
//                             route.request()
//                                 .method() === "PUT"
//                         ) {

//                             await route.fulfill({
//                                 status: 200,
//                                 contentType:
//                                     "application/json",
//                                 body:
//                                     JSON.stringify({
//                                         success: true
//                                     })
//                             });

//                             return;
//                         }

//                         if (
//                             route.request()
//                                 .method() === "DELETE"
//                         ) {

//                             await route.fulfill({
//                                 status: 200,
//                                 body: ""
//                             });

//                         }

//                     }
//                 );

//                 await page.goto(
//                     "/profile"
//                 );

//                 await expect(
//                     page.getByTestId(
//                         "name-input"
//                     )
//                 ).toBeVisible();

//             }
//         );

//         test(
//             "プロフィール表示",
//             async ({ page }) => {

//                 await expect(
//                     page.getByTestId(
//                         "name-input"
//                     )
//                 ).toHaveValue(
//                     "Test User"
//                 );

//             }
//         );

//     }
// );