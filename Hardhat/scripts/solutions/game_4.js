/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { parseUnits } = require('ethers');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(4);
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

  const payableContractAddress = deployInstanceEvents[0].args[0];

  const [owner] = await hre.ethers.getSigners();
  const txPayable = await owner.sendTransaction({
    to: payableContractAddress,
    value: parseUnits('1', 'wei'),
  });
  await txPayable.wait();
  console.log('1 wei sent to PayableContract');

  const contractBalance = Number(await hre.ethers.provider.getBalance(payableContractAddress));
  console.log('PayableContract balance:', contractBalance);

  if (contractBalance > 0) {
    console.log('Contract has a positive balance, proceeding with minting...');

    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const balance = await nftBadge.balanceOf(owner.address, 4);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(4, payableContractAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 4);
    console.log('Balance of token ID 4 for owner:', bal.toString());
  } else {
    console.log('Contract balance is zero; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
