import { Application } from 'express';
import mappingsRouter from './api/controllers/mappings/router';
export default function routes(app: Application): void {
  app.use('/api/v1/check_mapping', mappingsRouter);
}
