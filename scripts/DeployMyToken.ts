import { Provider } from "@ethersproject/providers";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config();


async function main() {
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey || privateKey.length <= 0)
    throw new Error("PRIVATE_KEY is not set");

  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);
  
  const signers = await ethers.getSigners();

  const balance = await signer.getBalance();
  console.log(`The account ${signer.address} has a balance of  ${balance} Wei`);

    console.log("Deploying MyToken contract");
   
  //DEPLOYMENT
    const myTokenContractFactory = new MyToken__factory(signer);
    console.log("Deploying MyToken contract...");
    const myTokenContract = await myTokenContractFactory.deploy()
    console.log("Awaiting for confirmations...");
    const txReceipts = await myTokenContract.deployTransaction.wait();
    console.log(`MyToken contract deployed to ${txReceipts.contractAddress} in the block number ${txReceipts.blockNumber}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});