import isValid from 'server/utils/decode';
import { createMapping, doesMappingExist } from 'server/utils/db';

export class MappingService {
  async createMapping(
    chainId: number,
    transactionHash: string,
    email: string,
    sender: string,
    message: string
  ): Promise<boolean> {
    const check = isValid(chainId, sender, email, transactionHash, message);
    if (!check) return false;
    const ret = await createMapping(sender, email);
    return ret;
  }

  async checkMapping(from: string, to: string): Promise<boolean> {
    const ret = await doesMappingExist(from, to);
    return ret;
  }
}

export default new MappingService();
