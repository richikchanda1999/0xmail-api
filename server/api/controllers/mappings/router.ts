import express from 'express';
import controller from './controller';
export default express
  .Router()
  .post('/create', controller.createMapping)
  .post('/check', controller.checkMapping);
