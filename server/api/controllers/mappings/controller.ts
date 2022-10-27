import MappingsService from '../../services/mappings.service';
import { Request, Response } from 'express';
import L from '../../../common/logger';

export class Controller {
  createMapping(req: Request, res: Response): void {
    L.info({ params: req.params }, 'Params');
    L.info({ body: req.body }, 'Body');
    MappingsService.createMapping(
      req.body['chainId'],
      req.body['transactionHash'],
      req.body['email'],
      req.body['sender'],
      req.body['message']
    ).then((data) => {
      L.info({ data }, 'Returned data');
      if (data.error) {
        res.status(400).json(data);
      } else {
        res.status(200).json(data);
      }
    });
  }

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
