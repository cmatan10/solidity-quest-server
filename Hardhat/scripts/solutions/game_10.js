/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(10);
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

  const interfaceIdAddress = deployInstanceEvents[0].args[0];

  const InterfaceId = await hre.ethers.getContractFactory('InterfaceId');
  const interfaceIdContract = InterfaceId.attach(interfaceIdAddress);

  const functionId = '0x794bc9a0';

  try {
    const txCalcMe = await interfaceIdContract.CalcMe(functionId);
    const receiptCalcMe = await txCalcMe.wait();
    console.log('CalcMe transaction receipt:', receiptCalcMe);
  } catch (error) {
    console.error('Error calling CalcMe:', error.message);
  }

  const answer = await interfaceIdContract.answer();
  console.log('Is the answer correct?:', answer);

  if (answer) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 10);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(10, interfaceIdAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 10);
    console.log('Balance of token ID 10 for owner:', bal.toString());
  } else {
    console.log('Function ID did not match; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
