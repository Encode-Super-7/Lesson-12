import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;

  // The contract address used here is for the MyToken contract
  const contractAddress = args[2];

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) {
    throw new Error("PRIVATE_KEY is not set");
  }
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  const contract = new MyToken__factory(signer);
  
  console.log(`Attaching to TokenizedBallot contract at address ${contractAddress} ...`);
  const deployedContract = contract.attach(contractAddress);
  console.log("Successfully attached!");
  console.log(`Self Delegating vote power for address ${signer.address}`)

  const tx = await deployedContract.connect(signer).delegate(signer.address);
  const txReceipt = await tx.wait()

  console.log(
        `The tokens were delegated for the account ${signer.address} at the block ${txReceipt.blockNumber}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});