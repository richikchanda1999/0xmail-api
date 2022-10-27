import { ethers } from 'ethers';
import sha256 from 'crypto-js/sha256';
import ABI from '../../abis/Communication.json';

type Data = {
  chainId?: number;
  emailHash?: string;
  sender?: string;
  walletAddress?: string;
  timestamp?: number;
  error?: string;
};

async function decodeTransaction(chainId: number, txHash: string) {
  let provider;
  if (chainId === 5) {
    provider = ethers.getDefaultProvider('goerli');
  } else if (chainId === 10) {
    provider = ethers.getDefaultProvider('optimism');
  } else if (chainId === 137) {
    provider = ethers.getDefaultProvider('matic');
  } else if (chainId === 42220) {
    provider = new ethers.providers.JsonRpcProvider('https://forno.celo.org');
  } else {
    return { error: 'Invalid chain ID' };
  }

  const tx = await provider.getTransactionReceipt(txHash);

  const iface = new ethers.utils.Interface(ABI);

  try {
    let data: Data = { error: 'No event found' };
    for (const log of tx.logs) {
      const event = iface.parseLog(log);
      if (event.name === 'EmailAdded') {
        data = {
          chainId: event.args.chainId.toNumber(),
          emailHash: event.args.emailHash,
          sender: event.args.sender,
          walletAddress: event.args.walletAddress,
          timestamp: event.args.timestamp.toNumber(),
        };
        break;
      }
    }

    return data;
  } catch (e) {
    return { error: `Some error occurred - ${e}` };
  }
}

async function main(
  chainIdFromAPI: number,
  senderFromAPI: string,
  email: string,
  txHash: string
) {
  const ret = await decodeTransaction(chainIdFromAPI, txHash);
  if (ret.error) {
    console.error(`Could not decode transaction: ${ret.error}`);
    return false;
  }
  console.log(ret);

  const { chainId, emailHash, sender, walletAddress, timestamp } = ret;
  if (!emailHash || !chainId || !sender || !walletAddress || !timestamp) {
    console.error('Could not decode transaction');
    return false;
  }

  if (chainId !== chainIdFromAPI) {
    console.error('Chain ID mismatch');
    return false;
  } else if (sender !== senderFromAPI) {
    console.error('Sender mismatch');
    return false;
  }

  const digest = sha256(email).toString();

  if (digest !== emailHash) {
    console.error('Emails do not match');
    return false;
  }

  return true;
}

main(
  5,
  '0x4e35fF1872A720695a741B00f2fA4D1883440baC',
  'richikchanda1999@gmail.com',
  '0x343eb6087ba0582e20578b089014a52613ef7b005eb604209ec7a2f691272b35'
).then((res) => console.log(res));

export default decodeTransaction;
