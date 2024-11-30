/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(8);
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

  const overflowAddress = deployInstanceEvents[0].args[0];

  const Overflow = await hre.ethers.getContractFactory('Overflow');
  const overflowContract = Overflow.attach(overflowAddress);

  const valueToAdd = 7;
  try {
    const txAdd = await overflowContract.add(valueToAdd);
    const receiptAdd = await txAdd.wait();
    console.log('add function transaction receipt:', receiptAdd);
  } catch (error) {
    console.error('Error calling add function:', error.message);
  }

  const overflowOccurred = await overflowContract.overflowOccurred();
  console.log('Did overflow occur?:', overflowOccurred);

  if (overflowOccurred) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 8);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(8, overflowAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 8);
    console.log('Balance of token ID 8 for owner:', bal.toString());
  } else {
    console.log('Overflow did not occur; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

