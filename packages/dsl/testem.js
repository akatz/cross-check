module.exports = {
  launchers: {
    Node: {
      cwd: process.env.EMBER_CLI_TEST_OUTPUT,
      command: `qunit "commonjs/test/**/*-test.js"`,
      protocol: "tap"
    }
  },

  framework: "qunit",
  test_page: "index.testem.html?hidepassed",

  browser_args: {
    Chrome: [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--remote-debugging-port=9222",
      "--user-data-dir=/tmp"
    ]
  },

  disable_watching: true,
  launch_in_ci: ["Node", "Chrome"],
  launch_in_dev: ["Node", "Chrome"]
};
