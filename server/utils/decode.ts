import { ethers } from 'ethers';
import sha256 from 'crypto-js/sha256';
import ABI from '../../abis/Communication.json';
import { hashMessage } from 'ethers/lib/utils';
import chainInfo from 'server/chainInfo';

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
) {
  if (!(chainIdFromAPI in chainInfo)) {
    return false;
  }

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

  const from = ethers.utils.recoverAddress(
    hashMessage(`I allow mails to be forwarded to ${email}`),
    message
  );

  if (from !== walletAddress) {
    console.error('Message not signed by the correct wallet');
    return false;
  }

  return true;
}

// async function test() {
//   const wallet = new ethers.Wallet(
//   );

//   const messageToSign =
//     'I allow mails to be forwarded to richikchanda1999@gmail.com';
//   const signature = await wallet.signMessage(messageToSign);

//   console.log(signature);
// }

// test();

isValid(
  5,
  '0x4e35fF1872A720695a741B00f2fA4D1883440baC',
  'richikchanda1999@gmail.com',
  '0x343eb6087ba0582e20578b089014a52613ef7b005eb604209ec7a2f691272b35',
  '0xb1c191cd5b0a76e314bac0c1ad859efb68fe5189dd744ed720a4f9dbc884385e58f759d8343fcf043f8ab9e5ea13beb1638f218df7193d1edb5abc1e5b0f37081c'
).then((res) => console.log(res));

export default isValid;
