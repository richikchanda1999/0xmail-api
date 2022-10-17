import type { Sequelize } from 'sequelize';
import { address_endpoints as _address_endpoints } from './address_endpoints';
import type {
  address_endpointsAttributes,
  address_endpointsCreationAttributes,
} from './address_endpoints';
import { routes as _routes } from './routes';
import type { routesAttributes, routesCreationAttributes } from './routes';

export { _address_endpoints as address_endpoints, _routes as routes };

export type {
  address_endpointsAttributes,
  address_endpointsCreationAttributes,
  routesAttributes,
  routesCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const address_endpoints = _address_endpoints.initModel(sequelize);
  const routes = _routes.initModel(sequelize);

  return {
    address_endpoints: address_endpoints,
    routes: routes,
  };
}
