const webpack = require("webpack");
const { parsed: localEnv } = require("dotenv").config();
const withSourceMaps = require("@zeit/next-source-maps");
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const commonsChunkConfig = require('./commons-chunk-config')

const plugins = [
  withSourceMaps,
  [
    withBundleAnalyzer,
    {
      analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
      analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
      bundleAnalyzerConfig: {
        server: {
          analyzerMode: "static",
          reportFilename: "../server-analyze.html"
        },
        browser: {
          analyzerMode: "static",
          reportFilename: "client-analyze.html"
        }
      }
    }
  ]
];

module.exports = withPlugins([...plugins], {
  distDir: '../.next',
  webpack: (config, { dev, isServer }) => {
    const conf = config;
    // Fixes npm packages that depend on `fs` module
    conf.node = {
      fs: "empty"
    };

    if (!isServer) {
      // eslint-disable-next-line 
      config = commonsChunkConfig(config, ["react",
        "redux", "antd", "lodash", "moment", "react-redux",
        "redux-saga", "store", "axios",
        "redux-logger", "object-path"])
    }

    conf.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/))
    conf.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    return conf;
  },
  serverRuntimeConfig: {
    apiBaseUrl: `http://localhost:${process.env.PORT || 3000}/api`
  },
  publicRuntimeConfig: {
    apiBaseUrl: '/api'
  }
});
