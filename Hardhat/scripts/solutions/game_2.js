// eslint-disable-next-line import/no-extraneous-dependencies
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(2);
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

  const fallbackAddress = deployInstanceEvents[0].args[0];

  const Fallback = await hre.ethers.getContractFactory('Fallback');
  const fallback = Fallback.attach(fallbackAddress);

  const txFallback = await fallback.fallback({ value: 0 });
  await txFallback.wait();
  console.log('Fallback function called');

  const numValue = await fallback.fixMe();
  console.log('Is `num` set to 1? :', numValue);

  const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
  const nftBadge = NFTBadge.attach(nftBadgeAddress);

  const [owner] = await hre.ethers.getSigners();
  const balance = await nftBadge.balanceOf(owner.address, 2);

  if (balance < 1) {
    const txNFTBadge = await nftBadge.mint(2, fallbackAddress);
    const receiptNFTBadge = await txNFTBadge.wait();
    console.log('Mint transaction receipt:', receiptNFTBadge);
  }
  const bal = await nftBadge.balanceOf(owner.address, 2);
  console.log('Balance of token ID 2 for owner:', bal.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
