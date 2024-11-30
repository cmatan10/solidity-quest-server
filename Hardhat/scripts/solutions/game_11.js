/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(11);
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

  const encodeDataAddress = deployInstanceEvents[0].args[0];

  const EncodeData = await hre.ethers.getContractFactory('EncodeData');
  const encodeDataContract = EncodeData.attach(encodeDataAddress);

  const encodedValue = '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000035745420000000000000000000000000000000000000000000000000000000000';

  try {
    const txEncode = await encodeDataContract.encode(encodedValue);
    const receiptEncode = await txEncode.wait();
    console.log('encode function transaction receipt:', receiptEncode);
  } catch (error) {
    console.error('Error calling encode:', error.message);
  }

  const result = await encodeDataContract._encodeStringAndUint();
  console.log('Encoded data stored in _encodeStringAndUint:', result);

  if (result === encodedValue) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 11);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(11, encodeDataAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 11);
    console.log('Balance of token ID 11 for owner:', bal.toString());
  } else {
    console.log('Encoded data did not match; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
