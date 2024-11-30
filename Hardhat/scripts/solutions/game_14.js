/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(14);
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

  const factoryAddress = deployInstanceEvents[0].args[0];

  const Factory = await hre.ethers.getContractFactory('Factory');
  const factoryContract = Factory.attach(factoryAddress);

  const salt = 1;
  const bytecode = await factoryContract.bytecode();

  const predictedAddress = await factoryContract.checkAddress(factoryAddress, salt, bytecode);
  console.log('Predicted address of SomeContract:', predictedAddress);

  try {
    const txDeploy = await factoryContract.deploy(predictedAddress);
    const receiptDeploy = await txDeploy.wait();
    console.log('deploy function transaction receipt:', receiptDeploy);
  } catch (error) {
    console.error('Error calling deploy:', error.message);
  }

  const correctPrediction = await factoryContract.correctPrediction();
  console.log('Was the address prediction correct?:', correctPrediction);

  if (correctPrediction) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 14);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(14, factoryAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 14);
    console.log('Balance of token ID 14 for owner:', bal.toString());
  } else {
    console.log('Address prediction was not correct; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
