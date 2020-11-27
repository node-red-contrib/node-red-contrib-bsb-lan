const path = require('path');
const { node } = require('webpack');

const html = {
  entry: {
    'bsb-lan-device-html': './src/bsb-lan-device.html.ts',
    'bsb-lan-html': './src/bsb-lan.html.ts'
  },
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'nodes')
  },
  target: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(process.cwd(), "./tsconfig.json")
            }
          }
        ]
      }
    ]
  }
};

const server = {
  entry: {
    'bsb-lan-device': './src/bsb-lan-device.ts',
    'bsb-lan': './src/bsb-lan.ts'
  },
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'nodes')
  },
  target: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(process.cwd(), "./tsconfig.json")
            }
          }
        ]
      }
    ]
  }
};

module.exports = [ html, server];