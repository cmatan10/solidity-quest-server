/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(15);
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

  const supportInterfaceAddress = deployInstanceEvents[0].args[0];

  const SupportInterface = await hre.ethers.getContractFactory('SupportInterface');
  const supportInterfaceContract = SupportInterface.attach(supportInterfaceAddress);

  const xorValue = '0x4199e8e3';

  try {
    const txCalculateXOR = await supportInterfaceContract.calculateXOR(xorValue);
    const receiptCalculateXOR = await txCalculateXOR.wait();
    console.log('calculateXOR function transaction receipt:', receiptCalculateXOR);
  } catch (error) {
    console.error('Error calling calculateXOR:', error.message);
  }

  const contractInterface = await supportInterfaceContract.contractInterface();
  console.log('Is the contract interface correct?:', contractInterface);

  if (contractInterface) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 15);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(15, supportInterfaceAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 15);
    console.log('Balance of token ID 15 for owner:', bal.toString());
  } else {
    console.log('Interface check failed; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
