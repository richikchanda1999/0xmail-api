import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface address_endpointsAttributes {
  id: number;
  server_id?: number;
  uuid?: string;
  address?: string;
  last_used_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type address_endpointsPk = 'id';
export type address_endpointsId = address_endpoints[address_endpointsPk];
export type address_endpointsOptionalAttributes =
  | 'id'
  | 'server_id'
  | 'uuid'
  | 'address'
  | 'last_used_at'
  | 'created_at'
  | 'updated_at';
export type address_endpointsCreationAttributes = Optional<
  address_endpointsAttributes,
  address_endpointsOptionalAttributes
>;

export class address_endpoints
  extends Model<
    address_endpointsAttributes,
    address_endpointsCreationAttributes
  >
  implements address_endpointsAttributes
{
  id!: number;
  server_id?: number;
  uuid?: string;
  address?: string;
  last_used_at?: Date;
  created_at!: Date;
  updated_at!: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof address_endpoints {
    return sequelize.define(
      'address_endpoints',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        server_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        uuid: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        last_used_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: 'address_endpoints',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      }
    ) as typeof address_endpoints;
  }
}
