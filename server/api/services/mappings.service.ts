import L from '../../common/logger';

interface Mapping {
  type: number;
  from: string;
  to: string;
}

const mappings: Mapping[] = [
  {
    type: 0,
    from: '5.0x01.0x4e35fF1872A720695a741B00f2fA4D1883440baC',
    to: 'richikchanda1999@gmail.com',
  },
];

export class MappingService {
  byType(type: number): Mapping[] {
    L.info(`fetch mapping with type ${type}`);
    return mappings.filter((mapping) => mapping.type === type);
  }
}

export default new MappingService();
