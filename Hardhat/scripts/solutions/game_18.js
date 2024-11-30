/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(18);
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

  const uncheckedAddress = deployInstanceEvents[0].args[0];

  const Unchecked = await hre.ethers.getContractFactory('Unchecked');
  const uncheckedContract = Unchecked.attach(uncheckedAddress);

  const [gasWithCheck, numWithCheck] = await uncheckedContract.increaseWithCheck();
  console.log('Gas used with check:', gasWithCheck.toString(), 'Num with check:', numWithCheck.toString());

  const [gasWithoutCheck, numWithoutCheck] = await uncheckedContract.increaseWithoutCheck();
  console.log('Gas used without check:', gasWithoutCheck.toString(), 'Num without check:', numWithoutCheck.toString());

  const gasDifference = gasWithCheck > gasWithoutCheck
    ? gasWithCheck - gasWithoutCheck
    : gasWithoutCheck - gasWithCheck;

  console.log('Calculated gas difference:', gasDifference.toString());

  try {
    const txCalculateGas = await uncheckedContract.calculateGasDifference(gasDifference);
    const receiptCalculateGas = await txCalculateGas.wait();
    console.log('calculateGasDifference transaction receipt:', receiptCalculateGas);
  } catch (error) {
    console.error('Error calling calculateGasDifference:', error.message);
    return;
  }

  const correctCalc = await uncheckedContract.correctCalc();
  console.log('Was the gas difference calculation correct?:', correctCalc);

  if (correctCalc) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 18);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(18, uncheckedAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 18);
    console.log('Balance of token ID 18 for owner:', bal.toString());
  } else {
    console.log('Gas difference calculation was incorrect; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
