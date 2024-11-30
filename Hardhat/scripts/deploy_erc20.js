/* eslint-disable import/no-extraneous-dependencies */
const { ethers, upgrades } = require('hardhat');
require('dotenv').config();

async function main() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  console.log(deployer);

  const { ERC20_SIGNER_PRI_KEY } = process.env;

  if (!ERC20_SIGNER_PRI_KEY) {
    throw new Error('Please set your ERC20_SIGNER_PRIVATE_KEY in a .env file');
  }

  // Create a signer from the private key and connect it to the provider
  const signer = new ethers.Wallet(ERC20_SIGNER_PRI_KEY, ethers.provider);

  const signerAddress = signer.address; // Use the deployer's address as the signer
  console.log(signerAddress);

  const hintPrice = ethers.parseUnits('50', 18); // 10 tokens with 18 decimals
  const solutionPrice = ethers.parseUnits('300', 18); // 20 tokens with 18 decimals

  const SolidityQuestCoin = await ethers.getContractFactory('SolidityQuestCoin', deployer);
  console.log('Deploying SolidityQuestCoin...');

  // Pass the additional arguments to the initializer function
  const ERC20 = await upgrades.deployProxy(
    SolidityQuestCoin,
    [signerAddress, hintPrice, solutionPrice],
    { initializer: 'initialize' },
  );

  await ERC20.waitForDeployment();
  const ERC20Address = await ERC20.getAddress();
  console.log('ERC20 deployed to:', ERC20Address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
