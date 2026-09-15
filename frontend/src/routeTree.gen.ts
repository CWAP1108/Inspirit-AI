/* eslint-disable */
// @ts-nocheck
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { healthRoute } from './routes/health';

const routeTree = rootRoute.addChildren([indexRoute, healthRoute]);

export { routeTree };
