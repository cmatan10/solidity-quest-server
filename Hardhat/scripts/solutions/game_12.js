/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(12);
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

  const hashCollisionAddress = deployInstanceEvents[0].args[0];

  const HashCollision = await hre.ethers.getContractFactory('HashCollision');
  const hashCollisionContract = HashCollision.attach(hashCollisionAddress);

  const guess = '0x2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b';

  try {
    const txCollision = await hashCollisionContract.findCollision(guess);
    const receiptCollision = await txCollision.wait();
    console.log('findCollision function transaction receipt:', receiptCollision);
  } catch (error) {
    console.error('Error calling findCollision:', error.message);
  }

  const collisionFound = await hashCollisionContract.collisionFound();
  console.log('Was a collision found?:', collisionFound);

  if (collisionFound) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 12);
    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(12, hashCollisionAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 12);
    console.log('Balance of token ID 12 for owner:', bal.toString());
  } else {
    console.log('Collision was not found; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

