import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;

  // The contract address used here is for the MyToken contract
  const contractAddress = args[2];
  const voterAddress = args[3];

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
  console.log(`Checking vote power for address ${voterAddress}`)

  const votingPower = await deployedContract.getVotes(voterAddress);

  console.log(
        `The voting power for account with address ${voterAddress} is ${ethers.utils.formatEther(votingPower)} tokens`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});