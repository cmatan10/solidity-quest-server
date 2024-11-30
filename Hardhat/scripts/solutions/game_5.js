/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(5);
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

  const timestampContractAddress = deployInstanceEvents[0].args[0];

  const Timestamp = await hre.ethers.getContractFactory('Timestamp');
  const timestampContract = Timestamp.attach(timestampContractAddress);

  const blockTimestamp = (await hre.ethers.provider.getBlock('latest')).timestamp;
  console.log('Current block timestamp:', blockTimestamp);

  try {
    const txTimeReset = await timestampContract.timeReset(blockTimestamp);
    const receiptTimeReset = await txTimeReset.wait();
    console.log('timeReset transaction receipt:', receiptTimeReset);
  } catch (error) {
    console.error('Error calling timeReset:', error.message);
  }

  const success = await timestampContract.success();
  console.log('Was the timestamp reset successfully? :', success);

  if (success) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 5);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(5, timestampContractAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 5);
    console.log('Balance of token ID 5 for owner:', bal.toString());
  } else {
    console.log('Timestamp reset was not successful; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
