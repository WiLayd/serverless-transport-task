import { TransportStatusEnum, TransportTypeEnum } from 'src/common/enums/transport.enum';

export type TransportItemType = {
  capacity: number;
  createdAt: string;
  id: string;
  licensePlate: string;
  model?: string;
  pricePerKmEUR: number;
  status: TransportStatusEnum;
  type: TransportTypeEnum;
};
