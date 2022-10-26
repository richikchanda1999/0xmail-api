import { ethers } from 'ethers';
import ABI from '../../abis/Communication.json';

async function decodeTransaction(chainId: number, txHash: string) {
  console.log(chainId, txHash);

  //   const provider = ethers.getDefaultProvider('matic');
  //   const provider = ethers.getDefaultProvider('optimism');

  const provider = ethers.getDefaultProvider('goerli');

  const tx = await provider.getTransaction(txHash);
  console.log(tx);

  const iface = new ethers.utils.Interface(ABI);
  const decodedData = iface.parseTransaction({
    data: tx.data,
    value: tx.value,
  });

  console.log(decodedData);
  const args = decodedData.args;

  try {
    const ret = {
      chainId: args['chainId'].toNumber(),
      emailHash: args['emailHash'],
      sender: args['sender'],
    };
    return ret;
  } catch (e) {
    return { error: e };
  }
}

decodeTransaction(
  5,
  '0x0fcc686540e2c2ae5b7defc570bdcd195c16ed463e53f8c9162b2a3c3b644d2c'
);

export default decodeTransaction;
