import { Provider } from "@ethersproject/providers";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let i = 0; i < array.length; i++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[i]));
  }
  return bytes32Array;
}

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

    const args = process.argv;
    console.log(`My Token contract address is ${args[2]}`)
    const proposals = args.slice(3);
   
    if (proposals.length <= 0) throw new Error("Missing proposals");
    console.log("Deploying TokenizedBallot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
    });

  //DEPLOYMENT
    const ballotContractFactory = new TokenizedBallot__factory(signer);
    console.log("Deploying TolenizedBallot contract...");
    const ballotContract = await ballotContractFactory.deploy(
      convertStringArrayToBytes32(proposals), args[2]
    );
    console.log("Awaiting for confirmations...");
    const txReceipts = await ballotContract.deployTransaction.wait();
    console.log(`TokenizedBallot contract deployed to ${txReceipts.contractAddress} in the block number ${txReceipts.blockNumber}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});