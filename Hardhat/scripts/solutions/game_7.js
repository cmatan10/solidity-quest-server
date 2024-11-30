/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
const { gameFactoryAddress, nftBadgeAddress } = require('./set_contracts');

async function main() {
  const GameFactory = await hre.ethers.getContractFactory('GameFactory');
  const gameFactory = GameFactory.attach(gameFactoryAddress);

  const tx = await gameFactory.deploy(7);
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

  const changePasswordAddress = deployInstanceEvents[0].args[0];

  const ChangePassword = await hre.ethers.getContractFactory('ChangePassword');
  const changePasswordContract = ChangePassword.attach(changePasswordAddress);

  let password;
  try {
    password = await hre.network.provider.send('eth_getStorageAt', [
      changePasswordAddress,
      '0x0',
      'latest',
    ]);
    console.log('Password from storage:', password);
  } catch (error) {
    console.error('Error fetching storage:', error);
    return;
  }

  const newPassword = BigInt('0x1234567890abcdef');

  try {
    const txChangePassword = await changePasswordContract.changePassword(password, newPassword);
    const receiptChangePassword = await txChangePassword.wait();
    console.log('changePassword transaction receipt:', receiptChangePassword);
  } catch (error) {
    console.error('Error calling changePassword:', error.message);
  }

  const previousPasswords = await changePasswordContract.PreviousPassword(0);
  console.log('Previous Passwords:', previousPasswords);

  if (previousPasswords > 0) {
    const NFTBadge = await hre.ethers.getContractFactory('NFTbadge');
    const nftBadge = NFTBadge.attach(nftBadgeAddress);

    const [owner] = await hre.ethers.getSigners();
    const balance = await nftBadge.balanceOf(owner.address, 7);

    if (balance < 1) {
      const txNFTBadge = await nftBadge.mint(7, changePasswordAddress);
      const receiptNFTBadge = await txNFTBadge.wait();
      console.log('Mint transaction receipt:', receiptNFTBadge);
    }

    const bal = await nftBadge.balanceOf(owner.address, 7);
    console.log('Balance of token ID 7 for owner:', bal.toString());
  } else {
    console.log('Password change was unsuccessful; minting conditions not met.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
