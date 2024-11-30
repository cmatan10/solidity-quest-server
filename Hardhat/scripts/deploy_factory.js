/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { ethers, upgrades } = require('hardhat');
const fs = require('fs');

async function main() {
  const gamesData = JSON.parse(fs.readFileSync('./utils/bytecodes.json', 'utf8'));

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  console.log(deployer);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Deployer balance:', ethers.formatEther(balance), 'MATIC');

  console.log('Preparing to deploy GameFactory proxy...');
  const GameFactory = await ethers.getContractFactory('GameFactory', deployer);

  const gameFactory = await upgrades.deployProxy(GameFactory, [], {
    initializer: 'initialize',
  });
  await gameFactory.waitForDeployment();

  const gameFactoryAddress = await gameFactory.getAddress();
  console.log('GameFactory deployed to:', gameFactoryAddress);

  for (const game of gamesData) {
    const { id, isHackingGame, bytecode } = game;

    const bytes = bytecode ? Buffer.from(bytecode.slice(2), 'hex') : '0x';
    console.log(`Adding game with ID ${id}, hackingGame: ${isHackingGame}`);

    const tx = await gameFactory.addGame(id, isHackingGame, bytes);
    await tx.wait();
    console.log(`Game with ID ${id} added successfully.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
