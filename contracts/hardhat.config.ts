import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

import "hardhat/types/runtime";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

import { HardhatUserConfig } from "hardhat/types";
import { providers, Signer } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import { PersonalSubgraphAnchor__factory } from "../contracts/build/types/factories/PersonalSubgraphAnchor__factory";

dotenv.config();

export interface Account {
  readonly signer: Signer;
  readonly address: string;
}

export const getAccounts = async (
  hre: HardhatRuntimeEnvironment
): Promise<Account[]> => {
  const accounts = [];
  const signers: Signer[] = await hre.ethers.getSigners();
  for (const signer of signers) {
    accounts.push({ signer, address: await signer.getAddress() });
  }
  return accounts;
};

const DEFAULT_TEST_MNEMONIC =
  "myth like bonus scare over problem client lizard pioneer submit female collect";

function getAccountMnemonic() {
  return process.env.MNEMONIC || DEFAULT_TEST_MNEMONIC;
}

function getDefaultProviderURL(network: string) {
  return `https://${network}.infura.io/v3/${process.env.INFURA_KEY}`;
}

export const deployContracts = async (
  hre: HardhatRuntimeEnvironment,
  signer?: Signer
): Promise<void> => {
  const PSANCHOR = (await hre.ethers.getContractFactory(
    "PersonalSubgraphAnchor",
    signer
  )) as PersonalSubgraphAnchor__factory;
  const psAnchor = await PSANCHOR.deploy();
  console.log("info", `PersonalSubgraphAnchor deployed: ${psAnchor.address}`);
};

task("deploy", "Deploy the contract").setAction(
  async ({}, hre: HardhatRuntimeEnvironment) => {
    const accounts = await getAccounts(hre);
    await deployContracts(hre, accounts[0].signer);
  }
);

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
    rinkeby: {
      chainId: 4,
      gas: 15000000,
      gasPrice: "auto",
      url: getDefaultProviderURL("rinkeby"),
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
