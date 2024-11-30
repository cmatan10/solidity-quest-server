/* eslint-disable import/no-extraneous-dependencies */
const hre = require('hardhat');

const { ethers } = hre;

async function main() {
  const contractName = 'Unchecked';
  const constructorArgs = [
    // example: ethers.utils.hexZeroPad('0x446f6e277420466f72676574205468652050617373776f726421', 32)
  ];
  await hre.run('compile');
  const contractArtifact = await hre.artifacts.readArtifact(contractName);
  let creationCode = contractArtifact.bytecode;
  if (constructorArgs.length > 0) {
    const argumentTypes = constructorArgs.map((arg) => {
      if (typeof arg === 'string' && arg.startsWith('0x') && arg.length === 66) {
        return 'bytes32';
      } if (typeof arg === 'string') {
        return 'string';
      } if (typeof arg === 'number') {
        return 'uint256';
      } if (typeof arg === 'boolean') {
        return 'bool';
      }
      throw new Error('Unsupported argument type');
    });

    const encodedArgs = ethers.utils.defaultAbiCoder.encode(argumentTypes, constructorArgs);
    creationCode += encodedArgs.slice(2);
  }
  console.log(`Creation code for ${contractName} with arguments ${JSON.stringify(constructorArgs)}:`);
  console.log(creationCode);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
