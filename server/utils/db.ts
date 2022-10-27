import { Sequelize } from 'sequelize';
import { initModels } from 'server/models/init-models';
import L from 'server/common/logger';

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
    }
  );
  const { address_endpoints, routes } = initModels(sequelize);
  return { address_endpoints, routes, sequelize };
}

async function doesMappingExist(from: string, to: string): Promise<boolean> {
  const models = getModels();
  if (!models) return false;

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
  if (!endpoint || !route) ret = false;
  else if (endpoint.id === route.endpoint_id) ret = true;

  await sequelize.close();

  return ret;
}

async function createMapping(from: string, to: string): Promise<boolean> {
  const models = getModels();
  if (!models) return false;

  const { address_endpoints, routes, sequelize } = models;

  const exists = await doesMappingExist(from, to);

  if (exists) return false;

  const t = await sequelize.transaction();

  try {
    await address_endpoints.create({ address: to }, { transaction: t });
    await routes.create({ name: from }, { transaction: t });

    await t.commit();
  } catch (e) {
    await t.rollback();
  }

  return true;
}

export { doesMappingExist, createMapping };
