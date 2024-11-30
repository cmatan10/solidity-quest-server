/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(6);
  const receipt = await tx.wait();

  console.log('Deploy transaction receipt:', receipt);

  const deployInstanceEvents = await gameFactory.queryFilter(
    gameFactory.filters.DeployInstance(null, null, null),
    receipt.blockNumber,
    receipt.blockNumber,
  );

  if (deployInstanceEvents.length > 0) {
    deployInstanceEvents.forEach((event, index) => {
      console.log(`Instance ${index + 1} deployed at:`, event.args[0]);
    });
  } else {
    console.error('Instance addresses not found in events');
  }

  const gasCheckerAddress = deployInstanceEvents[0].args[0];

  // Attach to the deployed GasChecker contract
  const GasChecker = await hre.ethers.getContractFactory('GasChecker');
  const gasChecker = GasChecker.attach(gasCheckerAddress);

  // Call complexOperation with 30 as the argument for iterations
  const txGasChecker = await gasChecker.complexOperation(30);
  const receiptGasChecker = await txGasChecker.wait();
  console.log('complexOperation transaction receipt:', receiptGasChecker);

  // Retrieve the gasUsed and GasChecked values
  const gasUsed = await gasChecker.gasUsed();
  console.log('Gas used in complexOperation:', gasUsed.toString());

  const gasChecked = await gasChecker.GasChecked();
  console.log('Was gas usage within specified range? :', gasChecked);

  // If gas usage is within the specified range, proceed with NFT badge minting
  if (gasChecked) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 6); // Assuming token ID 6 for this game

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(6, gasCheckerAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 6);
    console.log('Balance of token ID 6 for owner:', bal.toString());
  } else {
    console.log('Gas usage was not within the specified range; minting conditions not met.');
  }
}

// Run the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
