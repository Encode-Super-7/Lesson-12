import { ethers } from "hardhat"
import { ERC20Votes__factory, MyToken__factory } from "../typechain-types"

const MINT_VALUE = ethers.utils.parseEther("10")

async function main() {
    // get the Signer
    const [deployer, account1, account2]= await ethers.getSigners()

    // Create the contract factory
    const contractFactory = new MyToken__factory(deployer)

    // Deploy the contract
    const tokenContract = await contractFactory.deploy()
    const txReceipt = await tokenContract.deployTransaction.wait()
    console.log(`ERC20Votes contract was deployed at the address ${tokenContract.address} at the block ${txReceipt.blockNumber}`)

    // Mint the tokens
    const mintTx = await tokenContract.mint(account1.address, MINT_VALUE)
    const mintTxReceipt = await mintTx.wait()
    console.log(
        `The tokens were minted for the account of address ${account1.address}at the block ${mintTxReceipt.blockNumber}`
    )

    // Check the Balance of account1
    const account1Balance = await tokenContract.balanceOf(account1.address)
    console.log(
        `The balance of the account1 is ${ethers.utils.formatEther(account1Balance)} Tokens`
    )

    // Check the voting power
    let account1VotePower = await tokenContract.getVotes(account1.address)
    console.log(
        `The vote power of the account1 is ${ethers.utils.formatEther(account1VotePower)} Tokens`
    )

    // Self Delegate
    const delegateTx = await tokenContract
        .connect(account1)
        .delegate(account1.address)

    const delegateTxReceipt = await delegateTx.wait()
    console.log(
        `The tokens were delegated from the account 1 to itself at the block ${delegateTxReceipt.blockNumber}`
    )

    // Transfer
    const transferTx = await tokenContract
    .connect(account1)
    .transfer(account2.address, MINT_VALUE.div(2))

    const transferTxReceipt = await transferTx.wait()
    console.log(
        `The tokens were transfered from the account 1 to account2 at the block ${delegateTxReceipt.blockNumber}`
    )

     // Check the voting power of account1
     account1VotePower = await tokenContract.getVotes(account1.address)
     console.log(
         `The vote power of the account1 is ${ethers.utils.formatEther(account1VotePower)} Tokens`
     )

    // Check the Balance of account2
    const account2Balance = await tokenContract.balanceOf(account2.address)
    console.log(
        `The balance of the account2 is ${ethers.utils.formatEther(account2Balance)} Tokens`
    )   

    // Historic vote power
    const currentBlock = await ethers.provider.getBlock("latest")
    console.log(`We are currently at the block ${currentBlock.number}`)

    for (let index = 1; index < 5; index++) {
        account1VotePower = await tokenContract.getPastVotes(
            account1.address,
            currentBlock.number - index
        )

        console.log(
            `The vote power of the account1 is ${ethers.utils.formatEther(account1VotePower)} Tokens at ${currentBlock.number - index}`
        )
        
    }

  

   

}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})