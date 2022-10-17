import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface routesAttributes {
  id: number;
  uuid?: string;
  server_id?: number;
  domain_id?: number;
  endpoint_id?: number;
  endpoint_type?: string;
  name?: string;
  spam_mode?: string;
  created_at?: Date;
  updated_at?: Date;
  token?: string;
  mode?: string;
}

export type routesPk = 'id';
export type routesId = routes[routesPk];
export type routesOptionalAttributes =
  | 'id'
  | 'uuid'
  | 'server_id'
  | 'domain_id'
  | 'endpoint_id'
  | 'endpoint_type'
  | 'name'
  | 'spam_mode'
  | 'created_at'
  | 'updated_at'
  | 'token'
  | 'mode';
export type routesCreationAttributes = Optional<
  routesAttributes,
  routesOptionalAttributes
>;

export class routes
  extends Model<routesAttributes, routesCreationAttributes>
  implements routesAttributes
{
  id!: number;
  uuid?: string;
  server_id?: number;
  domain_id?: number;
  endpoint_id?: number;
  endpoint_type?: string;
  name?: string;
  spam_mode?: string;
  created_at?: Date;
  updated_at?: Date;
  token?: string;
  mode?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof routes {
    return sequelize.define(
      'routes',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        uuid: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        server_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        domain_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        endpoint_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        endpoint_type: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        spam_mode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        token: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        mode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        tableName: 'routes',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'index_routes_on_token',
            using: 'BTREE',
            fields: [{ name: 'token', length: 6 }],
          },
        ],
      }
    ) as typeof routes;
  }
}
