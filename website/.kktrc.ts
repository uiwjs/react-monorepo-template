import path from "path";
import webpack, { Configuration } from "webpack";
import lessModules from "@kkt/less-modules";
import rawModules from "@kkt/raw-modules";
import scopePluginOptions from "@kkt/scope-plugin-options";
import { LoaderConfOptions } from "kkt";
import pkg from "./package.json";

export default (
  conf: Configuration,
  env: "development" | "production",
  options: LoaderConfOptions
) => {
  conf = lessModules(conf, env, options);
  conf = rawModules(conf, env, options);
  conf = scopePluginOptions(conf, env, {
    ...options,
    allowedFiles: [
      path.resolve(process.cwd(), "README.md"),
      path.resolve(process.cwd(), "src"),
    ],
  });
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    })
  );

  if (env === "production") {
    conf.output = { ...conf.output, publicPath: "./" };
    conf.optimization = {
      ...conf.optimization,
      splitChunks: {
        cacheGroups: {
          reactvendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react-vendor",
            chunks: "all",
          },
          refractor: {
            test: /[\\/]node_modules[\\/](refractor)[\\/]/,
            name: "refractor-prismjs-vendor",
            chunks: "all",
          },
        },
      },
    };
  }

  return conf;
};
