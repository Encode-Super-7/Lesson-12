import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;

  // The contract address used here is for the MyToken contract
  const contractAddress = args[2];
  const tokensMinted = args[3];
  const giveTokensToAddress = args[4];

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
  console.log(`Minting ${tokensMinted} tokens for account at address ${giveTokensToAddress}`)

  const tx = await deployedContract.connect(signer).mint(giveTokensToAddress, ethers.utils.parseEther(tokensMinted));
  await tx.wait()
  // Check the Balance of account1
  const account1Balance = await deployedContract.balanceOf(giveTokensToAddress)
  console.log(
        `The balance of ${giveTokensToAddress} is ${ethers.utils.formatEther(account1Balance)} Tokens`
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});