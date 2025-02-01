require('dotenv').config();
const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");
    
function initCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(path.resolve(
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const canisterConfig = network === "local" ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev[canisterName.toUpperCase() + "_CANISTER_ID"] =
      canisterDetails[network];
    return prev;
  }, {});
}
const canisterEnvVariables = initCanisterEnv();

const isDevelopment = process.env.NODE_ENV !== "production";

let internetIdentityUrl;

if (network === "local") {
    if (canisterEnvVariables["INTERNET_IDENTITY_CANISTER_ID"]) {
        internetIdentityUrl = `http://${canisterEnvVariables["INTERNET_IDENTITY_CANISTER_ID"]}.localhost:4943/`;
    } else {
        throw new Error("INTERNET_IDENTITY_CANISTER_ID is not set!");
    }
} else {
    internetIdentityUrl = `https://identity.ic0.app`;
}

console.log("URL:" + internetIdentityUrl);

const frontendDirectory = "/Vaulttera_frontend/";

const frontend_entry = path.join("src", frontendDirectory, "index.html");

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {motoko: './src/Vaulttera_frontend/js/motoko.js', login: './src/Vaulttera_frontend/js/login.js', nav: './src/Vaulttera_frontend/js/navigation.js'},
  output: {
    filename: '[name]bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: isDevelopment ? "source-map" : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
    alias: {
      '@dfinity/agent': path.resolve(__dirname, 'node_modules/@dfinity/agent'),
    },
    fullySpecified: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, frontend_entry),
      cache: false,
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      II_URL: internetIdentityUrl,
      ...canisterEnvVariables,
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `src/${frontendDirectory}/src/.ic-assets.json*`,
          to: ".ic-assets.json5",
          noErrorOnMissing: true
        },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.CANISTER_ID_VAULTTERA_BACKEND': JSON.stringify(process.env.CANISTER_ID_VAULTTERA_BACKEND),
    }),
  ],
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    static: path.resolve(__dirname, "src", frontendDirectory, "assets"),
    hot: true,
    watchFiles: [path.resolve(__dirname, "src", frontendDirectory)],
    liveReload: true,
  },
};
console.log('Canister ID:', process.env.CANISTER_ID_VAULTTERA_BACKEND);

