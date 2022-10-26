import { initModels } from '../../models/init-models';
import { Sequelize } from 'sequelize';
import L from '../../common/logger';
import chainInfo from 'server/chainInfo';

export class MappingService {
  async createMapping(
    chainId: number,
    transactionHash: string,
    message: string
  ): Promise<boolean> {
    if (
      !process.env.DATABASE ||
      !process.env.USERNAME ||
      !process.env.PASSWORD ||
      !message ||
      !transactionHash
    )
      return false;
    const sequelize = new Sequelize(
      process.env.DATABASE,
      process.env.USERNAME,
      process.env.PASSWORD,
      {
        host: 'localhost',
        dialect: 'mysql',
      }
    );
    await sequelize.authenticate();

    const { address_endpoints, routes } = initModels(sequelize);

    const ret = false;

    if (!(chainId in chainInfo)) return false;
    // Step 1: Check if the transaction has gone through
    console.log(typeof Object.keys(chainInfo)[0]);
    // Step 2: Decode the transaction and get the webwallet address
    // Step 3: Decrypt the event parameters with the webwallet address
    // Step 4: Check if the from -> to mapping already exists
    // Step 5: Check if hash(email) = hashed email emitted as event
    // Step 5: Create the mapping

    await sequelize.close();

    return ret;
  }

  async checkMapping(from: string, to: string): Promise<boolean> {
    if (
      !process.env.DATABASE ||
      !process.env.USERNAME ||
      !process.env.PASSWORD ||
      !from ||
      !to
    )
      return false;
    const sequelize = new Sequelize(
      process.env.DATABASE,
      process.env.USERNAME,
      process.env.PASSWORD,
      {
        host: 'localhost',
        dialect: 'mysql',
      }
    );
    await sequelize.authenticate();

    const { address_endpoints, routes } = initModels(sequelize);

    const endpoint = await address_endpoints.findOne({
      attributes: ['id', 'address'],
      where: { address: to },
    });

    const route = await routes.findOne({
      attributes: ['endpoint_id', 'name'],
      where: { name: from },
    });

    L.info({ endpoint, route }, 'checkMapping');

    let ret = false;
    if (!endpoint || !route) ret = false;
    else if (endpoint.id === route.endpoint_id) ret = true;

    await sequelize.close();

    return ret;
  }
}

export default new MappingService();
