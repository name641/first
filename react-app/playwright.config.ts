import {
  defineConfig,
  devices,
} from "@playwright/test";

export default defineConfig({

  testDir: "./e2e",

  timeout: 120000,

  expect: {
    timeout: 10000,
  },

  fullyParallel: false,

  forbidOnly:
    !!process.env.CI,

  retries:
    process.env.CI
      ? 2
      : 0,

  workers:
    process.env.CI
      ? 1
      : 1,

  reporter: "html",

  use: {
    baseURL:
      "http://localhost:5173",

    screenshot:
      "only-on-failure",

    video:
      "retain-on-failure",

    trace:
      "on-first-retry",

    headless: false,
  },

  projects: [
    {
      name:
        "chromium",

      use: {
        ...devices[
          "Desktop Chrome"
        ],
      },
    },
  ],

  webServer: {
    command:
      "npm run dev",

    url:
      "http://localhost:5173",

    reuseExistingServer:
      true,

    timeout:
      120000,
  },
});


// import {
//   defineConfig,
//   devices,
// } from "@playwright/test";

// export default defineConfig({
//   testDir: "./e2e",

//   timeout: 60000,

//   expect: {
//     timeout: 10000,
//   },

//   fullyParallel: false,

//   forbidOnly:
//     !!process.env.CI,

//   retries:
//     process.env.CI
//       ? 2
//       : 0,

//   workers:
//     process.env.CI
//       ? 1
//       : undefined,

//   reporter: "html",

//   use: {
//     baseURL:
//       "http://localhost:5173",

//     navigationTimeout: 30000,

//     screenshot:
//       "only-on-failure",

//     video:
//       "retain-on-failure",

//     trace:
//       "on-first-retry",

//     headless: true,
//   },

//   projects: [
//     {
//       name:
//         "chromium",
//       use: {
//         ...devices[
//           "Desktop Chrome"
//         ],
//       },
//     },
//   ],

//   webServer: {
//     command:
//       "npm run dev",

//     url:
//       "http://localhost:5173",

//     reuseExistingServer:
//       true,

//     timeout:  
//       120000,
//   },
// });
