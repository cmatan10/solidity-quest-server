const solc = require('solc');

const compileCode = (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({ error: 'No code provided' });
    }

    const input = {
      language: 'Solidity',
      sources: {
        'Contract.sol': {
          content: code,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode'],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors && output.errors.length > 0) {
      const errors = output.errors
        .filter((err) => err.severity === 'error')
        .map((err) => err.formattedMessage)
        .join('\n');

      if (errors.length > 0) {
        return res.status(400).json({ error: errors });
      }
    }

    if (!output.contracts || !output.contracts['Contract.sol']) {
      return res.status(400).json({ error: 'No contracts found in the code.' });
    }

    const contracts = output.contracts['Contract.sol'];
    const compiledContracts = {};

    for (const contractName in contracts) {
      compiledContracts[contractName] = {
        abi: contracts[contractName].abi,
        bytecode: contracts[contractName].evm.bytecode.object,
      };
    }

    if (Object.keys(compiledContracts).length === 0) {
      return res.status(400).json({ error: 'No contracts were compiled from the provided code.' });
    }

    res.json(compiledContracts);
  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ error: 'Compilation failed due to an internal error.' });
  }
};

module.exports = { compileCode };
