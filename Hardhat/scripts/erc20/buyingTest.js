/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');

async function main() {
  const accounts = await hre.ethers.getSigners();
  const buyer = accounts[1]; // The account that will claim the tokens

  console.log('buyer address:', buyer.address);

  const contractAddress = '0xecB2b021E8734d09eEE73053fdD8C4F6dFDe69D0';

  // Attach to the deployed SolidityQuestCoin contract
  const SolidityQuestCoin = await hre.ethers.getContractFactory('SolidityQuestCoin');
  const solidityQuestCoin = SolidityQuestCoin.attach(contractAddress);

  // Verify the buyer's balance
  const buyerBalance = await solidityQuestCoin.balanceOf(buyer.address);
  console.log("buyer's token balance:", hre.ethers.formatUnits(buyerBalance, 18));

  const hintId = 6; // The ID of the hint to buy
  const solutionId = 6; // The ID of the solution to buy

  // Check the hint status before buying
  let isHintPurchased = await solidityQuestCoin.hints(buyer.address, hintId);
  console.log(`Before purchase, Hint ID ${hintId} status for ${buyer.address}:`, isHintPurchased);

  // Call the buyHint function
  const hintTx = await solidityQuestCoin
    .connect(buyer)
    .buyHint(buyer.address, hintId);

  // Wait for the transaction to be mined
  await hintTx.wait();
  console.log(`buyHint called by ${buyer.address}`);

  // Check the hint status after buying
  isHintPurchased = await solidityQuestCoin.hints(buyer.address, hintId);
  console.log(`After purchase, Hint ID ${hintId} status for ${buyer.address}:`, isHintPurchased);

  // Verify the buyer's balance after buying the hint
  const buyerBalanceAfterHint = await solidityQuestCoin.balanceOf(buyer.address);
  console.log("buyer's balance after hint purchase:", hre.ethers.formatUnits(buyerBalanceAfterHint, 18));

  // Check the solution status before buying
  let isSolutionPurchased = await solidityQuestCoin.solutions(buyer.address, solutionId);
  console.log(`Before purchase, Solution ID ${solutionId} status for ${buyer.address}:`, isSolutionPurchased);

  // Call the buySolution function
  const solutionTx = await solidityQuestCoin
    .connect(buyer)
    .buySolution(buyer.address, solutionId);

  // Wait for the transaction to be mined
  await solutionTx.wait();
  console.log(`buySolution called by ${buyer.address}`);

  // Check the solution status after buying
  isSolutionPurchased = await solidityQuestCoin.solutions(buyer.address, solutionId);
  console.log(`After purchase, Solution ID ${solutionId} status for ${buyer.address}:`, isSolutionPurchased);

  // Verify the buyer's balance after buying the solution
  const buyerBalanceAfterSolution = await solidityQuestCoin.balanceOf(buyer.address);
  console.log("buyer's balance after solution purchase:", hre.ethers.formatUnits(buyerBalanceAfterSolution, 18));
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
