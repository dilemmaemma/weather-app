const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const DEVELOPMENT = 'development'
const ENV = process.env.NODE_ENV || DEVELOPMENT
const IS_DEV = ENV === DEVELOPMENT

const HTML_LOADER = 'html-loader'
const STYLE_LOADER = 'style-loader'
const CSS_LOADER = 'css-loader'
const BABEL_LOADER = 'babel-loader'
const STRING_REPLACE_LOADER = 'string-replace-loader'

const SERVER_URL = /http:\/\/localhost:9000/g
const FRONTEND_PORT = 3000

const INDEX_HTML_PATH = './public/index.html'
const INDEX_JS_PATH = './src/frontend/index.js'
const DIST_FOLDER = 'dist'
const BUNDLE_FILE = 'index.js'

const SOURCE_MAP = IS_DEV ? 'source-map' : false

const config = {
  entry: INDEX_JS_PATH,
  mode: ENV,
  output: {
    filename: BUNDLE_FILE,
    publicPath: '/',
    path: path.resolve(__dirname, DIST_FOLDER),
  },
  devtool: SOURCE_MAP,
  plugins: [
    new HtmlWebpackPlugin({
      template: INDEX_HTML_PATH,
    }),
  ],
  devServer: {
    static: path.join(__dirname, DIST_FOLDER),
    historyApiFallback: true,
    compress: true,
    port: FRONTEND_PORT,
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        exclude: /node_modules/,
        use: { loader: HTML_LOADER }
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: { loader: BABEL_LOADER },
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          STYLE_LOADER,
          CSS_LOADER,
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/i, // Match image files
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]', // Output file name and extension
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader', // Inject CSS into the DOM
          'css-loader',   // Translates CSS into CommonJS
          'sass-loader'   // Compiles Sass to CSS
        ],
      },
      {
        test: /\.less$/,  // Match .less files
        use: [
          'style-loader',  // Inject styles into the DOM
          'css-loader',    // Handle CSS imports
            {
                loader: 'less-loader',  // Compile Less to CSS
                options: {
                    lessOptions: {
                        javascriptEnabled: true,  // Enable inline JavaScript
                    },
                },
            },
        ],
      },
      {
        test: /\.(pdf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // Output file name and path
              name: '[name].[ext]',
              outputPath: 'public/', // Output directory within your build folder
            },
          },
        ],
      },
    ],
  },
}

if (!IS_DEV) {
  config.module.rules.push({
    test: /\.m?js$/,
    exclude: /node_modules/,
    use: {
      loader: STRING_REPLACE_LOADER,
      options: {
        search: SERVER_URL,
        replace: '',
      },
    },
  })
}

module.exports = config
