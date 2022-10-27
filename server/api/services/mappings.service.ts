import isValid from '../../utils/decode';
import { createMapping, doesMappingExist } from '../../utils/db';
import { MappingResult } from 'server/utils/types';

export class MappingService {
  async createMapping(
    chainId: number,
    transactionHash: string,
    email: string,
    sender: string,
    message: string
  ): Promise<MappingResult> {
    const exists = await doesMappingExist(sender, email);
    if (exists) {
      return { error: 'Mapping already exists', value: false };
    }
    const check = await isValid(
      chainId,
      sender,
      email,
      transactionHash,
      message
    );
    if (!check.value) return check;
    const ret = await createMapping(sender, email);
    return ret;
  }

  async checkMapping(from: string, to: string): Promise<MappingResult> {
    const ret = await doesMappingExist(from, to);
    return ret;
  }
}

export default new MappingService();
