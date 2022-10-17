import MappingsService from '../../services/mappings.service';
import { Request, Response } from 'express';
import L from '../../../common/logger';

export class Controller {
  checkMapping(req: Request, res: Response): void {
    L.info({ params: req.params }, 'Params');
    L.info({ body: req.body }, 'Body');
    MappingsService.checkMapping(req.body['from'], req.body['to']).then(
      (data) => {
        L.info({ data }, 'Returned data');
        res.json(data);
      }
    );
  }
}
export default new Controller();
