import { initModels } from '../../models/init-models';
import { Sequelize } from 'sequelize';
import L from '../../common/logger';

export class MappingService {
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
