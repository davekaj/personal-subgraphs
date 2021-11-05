// SPDX-License-Identifier: MIT

import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

import "hardhat/types/runtime";
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";

// Plugins
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const DEFAULT_TEST_MNEMONIC =
  "myth like bonus scare over problem client lizard pioneer submit female collect";

function getAccountMnemonic() {
  return process.env.MNEMONIC || DEFAULT_TEST_MNEMONIC;
}

function getDefaultProviderURL(network: string) {
  return `https://${network}.infura.io/v3/${process.env.INFURA_KEY}`;
}

const config: HardhatUserConfig = {
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./build/contracts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      loggingEnabled: false,
      gas: "auto",
      gasPrice: "auto",
      blockGasLimit: 30000000,
      accounts: {
        mnemonic: DEFAULT_TEST_MNEMONIC,
      },
    },
    mainnet: {
      chainId: 1,
      gas: "auto",
      gasPrice: "auto",
      blockGasLimit: 30000000,
      url: getDefaultProviderURL("mainnet"),
      accounts: {
        mnemonic: getAccountMnemonic(),
      },
    },
  },
  typechain: {
    outDir: "build/types",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
