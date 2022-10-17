import MappingsService from '../../services/mappings.service';
import { Request, Response } from 'express';
import L from '../../../common/logger';

export class Controller {
  byType(req: Request, res: Response): void {
    L.info({ params: req.params }, 'Params');
    const type = Number.parseInt(req.params['type']);
    L.info({ type }, 'Type');
    const data = MappingsService.byType(type);
    res.json(data);
  }
}
export default new Controller();
