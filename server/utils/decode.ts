import { ethers } from 'ethers';
import sha256 from 'crypto-js/sha256';
import ABI from '../../abis/Communication.json';
import { hashMessage } from 'ethers/lib/utils';
import chainInfo from '../chainInfo';
import { CreateMappingResult } from './types';

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

async function isValid(
  chainIdFromAPI: number,
  senderFromAPI: string,
  email: string,
  txHash: string,
  message: string
): Promise<CreateMappingResult> {
  if (!(chainIdFromAPI in chainInfo)) {
    return { error: 'Chain ID not supported', value: false };
  }

  const ret = await decodeTransaction(chainIdFromAPI, txHash);
  if (ret.error) {
    return {
      error: `Could not decode transaction: ${ret.error}`,
      value: false,
    };
  }
  console.log(ret);

  const { chainId, emailHash, sender, walletAddress, timestamp } = ret;
  if (!emailHash || !chainId || !sender || !walletAddress || !timestamp) {
    return { error: 'Could not decode transaction', value: false };
  }

  if (chainId !== chainIdFromAPI) {
    return { error: 'Chain ID mismatch', value: false };
  } else if (sender !== senderFromAPI) {
    return { error: 'Sender mismatch', value: false };
  }

  const digest = sha256(email).toString();

  if (digest !== emailHash) {
    return { error: 'Emails do not match', value: false };
  }

  const from = ethers.utils.recoverAddress(
    hashMessage(`I allow mails to be forwarded to ${email}`),
    message
  );

  if (from !== walletAddress) {
    return { error: 'Message not signed by the correct wallet', value: false };
  }

  return { value: true };
}

export default isValid;
