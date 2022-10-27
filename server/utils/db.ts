import { Sequelize } from 'sequelize';
import { initModels } from '../models/init-models';
import L from '../common/logger';
import { MappingResult } from './types';

function getModels() {
  if (
    !process.env.DATABASE ||
    !process.env.USERNAME ||
    !process.env.PASSWORD ||
    !process.env.HOST
  )
    return;
  const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USERNAME,
    process.env.PASSWORD,
    {
      host: process.env.HOST,
      dialect: 'mysql',
      protocol: 'tcp',
    }
  );
  const { address_endpoints, routes } = initModels(sequelize);
  return { address_endpoints, routes, sequelize };
}

async function doesMappingExist(
  from: string,
  to: string
): Promise<MappingResult> {
  const models = getModels();
  if (!models)
    return {
      error: 'Could not connect to database and initialise models',
      value: false,
    };

  const { address_endpoints, routes, sequelize } = models;

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
  let error;
  if (!endpoint || !route) {
    error = 'Failed to fetch data from database';
    ret = false;
  } else if (endpoint.id === route.endpoint_id) ret = true;

  await sequelize.close();

  return { error, value: ret };
}

async function createMapping(from: string, to: string): Promise<MappingResult> {
  const models = getModels();
  if (!models)
    return {
      error: 'Could not connect to database and initialise models',
      value: false,
    };

  const { address_endpoints, routes, sequelize } = models;

  const t = await sequelize.transaction();

  try {
    await address_endpoints.create({ address: to }, { transaction: t });
    await routes.create({ name: from }, { transaction: t });

    await t.commit();
    return { value: true };
  } catch (e) {
    await t.rollback();
    return {
      error: `Could not create mapping. Rolling back changes: ${e}`,
      value: false,
    };
  }
}

export { doesMappingExist, createMapping };
