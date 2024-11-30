/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(3);
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

  const BalanceCheckerAddress = deployInstanceEvents[0].args[0];
  const BalanceChecker = await hre.ethers.getContractFactory('BalanceChecker');
  const balanceChecker = BalanceChecker.attach(BalanceCheckerAddress);

  const txBalanceChecker = await balanceChecker.checkBalance(BalanceCheckerAddress, 0);
  await txBalanceChecker.wait();
  console.log('checkBalance function called');

  const Value = await balanceChecker.correctBalanceChecked();
  console.log('correctBalanceChecked', Value);

  const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
  const nftBadge = NFTBadge.attach(nftBadgeAddress);

  const [owner] = await hre.ethers.getSigners();
  const balance = await nftBadge.balanceOf(owner.address, 3);

  if (balance < 1) {
    const txNFTBadge = await nftBadge.mint(3, BalanceCheckerAddress);
    const receiptNFTBadge = await txNFTBadge.wait();
    console.log('Mint transaction receipt:', receiptNFTBadge);
  }
  const bal = await nftBadge.balanceOf(owner.address, 3);
  console.log('Balance of token ID 3 for owner:', bal.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
