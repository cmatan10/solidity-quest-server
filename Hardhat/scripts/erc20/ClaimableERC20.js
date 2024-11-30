/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');
require('dotenv').config(); // Ensure you have dotenv installed and a .env file with ERC20_SIGNER_PRI_KEY

async function main() {
  const { ethers } = hre;

  // Retrieve the private key from environment variables
  const privateKey = process.env.ERC20_SIGNER_PRI_KEY;
  if (!privateKey) {
    throw new Error('Please set your ERC20_SIGNER_PRI_KEY in a .env file');
  }

  // Create a Wallet instance (Signer) from the private key and connect it to the provider
  const signer = new ethers.Wallet(privateKey, ethers.provider);

  // Alternatively, if you're using a specific network, ensure the provider is correctly set
  // const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
  // const signer = new ethers.Wallet(privateKey, provider);

  // Define the claimer account (ensure it's different from the signer if needed)
  const claimer = (await ethers.getSigners())[1]; // The account that will claim the tokens

  console.log('Deployer address:', signer.address);
  console.log('Claimer address:', claimer.address);

  const contractAddress = '0xecB2b021E8734d09eEE73053fdD8C4F6dFDe69D0';

  const SolidityQuestCoin = await ethers.getContractFactory('SolidityQuestCoin');
  const solidityQuestCoin = SolidityQuestCoin.attach(contractAddress);

  console.log('Attempting to claim more tokens...');

  const amount = ethers.parseUnits('100', 18);
  const nonce = 83;

  const messageHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256', 'uint256'],
    [claimer.address, amount, nonce],
  );

  // Sign the message hash using the signer
  const signature = await signer.signMessage(ethers.getBytes(messageHash));

  console.log('Message hash:', messageHash);
  console.log('Signature:', signature);

  // Execute the claim transaction using the claimer's signer
  const claimTx = await solidityQuestCoin
    .connect(claimer)
    .claim(amount, nonce, signature);

  await claimTx.wait();
  console.log(`Tokens successfully claimed by ${claimer.address}`);

  const claimerBalance = await solidityQuestCoin.balanceOf(claimer.address);
  console.log("Claimer's token balance:", ethers.formatUnits(claimerBalance, 18));

  const lastNonce = await solidityQuestCoin.nonces(claimer.address);
  console.log("Claimer's last used nonce:", lastNonce.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
