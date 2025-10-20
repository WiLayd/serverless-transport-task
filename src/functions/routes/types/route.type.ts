import { RouteStatusEnum } from 'src/common/enums/route.enum';
import { TransportTypeEnum } from 'src/common/enums/transport.enum';

export type RouteItemType = {
  completionDate?: string | null;
  costEUR?: number;
  costUAH?: number;
  costUSD?: number;
  createdAt: string;
  dispatchDate: string;
  distanceKm: number;
  endCity: string;
  expectedRevenueUSD: number;
  id: string;
  requiredTransportType: TransportTypeEnum;
  startCity: string;
  status: RouteStatusEnum;
  transportId?: string | null;
};
