/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(9);
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

  const blockHashAddress = deployInstanceEvents[0].args[0];

  const BlockHash = await hre.ethers.getContractFactory('BlockHash');
  const blockHashContract = BlockHash.attach(blockHashAddress);

  const latestBlockNumber = await hre.ethers.provider.getBlockNumber();
  const targetBlockNumber = latestBlockNumber - 1;
  const targetBlock = await hre.ethers.provider.getBlock(targetBlockNumber);
  const targetBlockHash = targetBlock.hash;

  console.log('Checking block hash for block number:', targetBlockNumber);
  console.log('Block hash:', targetBlockHash);

  try {
    const txBlockHashCheck = await blockHashContract.blockHashCheck(targetBlockNumber, targetBlockHash);
    const receiptBlockHashCheck = await txBlockHashCheck.wait();
    console.log('blockHashCheck transaction receipt:', receiptBlockHashCheck);
  } catch (error) {
    console.error('Error calling blockHashCheck:', error.message);
  }

  const correctBlockHash = await blockHashContract.correctBlockHash();
  console.log('Is the block hash correct?:', correctBlockHash);

  if (correctBlockHash) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 9);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(9, blockHashAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 9);
    console.log('Balance of token ID 9 for owner:', bal.toString());
  } else {
    console.log('Block hash did not match; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
