import { randomUUID } from 'crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { RouteStatusEnum } from 'src/common/enums/route.enum';
import { TransportStatusEnum, TransportTypeEnum } from 'src/common/enums/transport.enum';
import { db } from 'src/lib/dynamodb-client';

const stage = process.env.STAGE || 'dev';

const TRANSPORT_TABLE_NAME = `transsport-table-${stage}`;
const ROUTES_TABLE_NAME = `routess-table-${stage}`;

async function seed() {
  const transportId1 = randomUUID();
  const transportId2 = randomUUID();

  const transportItems = [
    {
      id: randomUUID(),
      licensePlate: 'AA 1234 BC',
      model: 'Volvo FH16',
      type: TransportTypeEnum.TRUCK,
      purchaseDate: '2023-05-15',
      status: TransportStatusEnum.FREE,
      pricePerKmEUR: 1.8,
      capacity: 24000,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      licensePlate: 'BH 5678 AI',
      model: 'Mercedes-Benz Actros',
      type: TransportTypeEnum.TRUCK,
      purchaseDate: '2022-11-20',
      status: TransportStatusEnum.FREE,
      pricePerKmEUR: 1.9,
      capacity: 25000,
      createdAt: new Date().toISOString(),
    },
    {
      id: transportId1,
      licensePlate: 'CE 9012 EH',
      model: 'Scania R-series',
      type: TransportTypeEnum.TRUCK,
      purchaseDate: '2024-03-10',
      status: TransportStatusEnum.BUSY,
      pricePerKmEUR: 1.7,
      capacity: 24000,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      licensePlate: 'AB 1122 IK',
      model: 'MAN TGX',
      type: TransportTypeEnum.TRUCK,
      purchaseDate: '2021-08-01',
      status: TransportStatusEnum.FREE,
      pricePerKmEUR: 1.6,
      capacity: 23000,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      licensePlate: 'BI 3344 KM',
      model: 'DAF XF',
      type: TransportTypeEnum.TRUCK,
      purchaseDate: '2023-01-30',
      status: TransportStatusEnum.FREE,
      pricePerKmEUR: 1.75,
      capacity: 24500,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      licensePlate: 'AX 5566 OI',
      model: 'Ford Transit',
      type: TransportTypeEnum.CAR,
      purchaseDate: '2023-09-05',
      status: TransportStatusEnum.FREE,
      pricePerKmEUR: 0.8,
      capacity: 1500,
      createdAt: new Date().toISOString(),
    },
    {
      id: transportId2,
      licensePlate: 'BC 7788 AP',
      model: 'Mercedes-Benz Sprinter',
      type: TransportTypeEnum.CAR,
      purchaseDate: '2024-01-12',
      status: TransportStatusEnum.BUSY,
      pricePerKmEUR: 0.9,
      capacity: 1800,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      licensePlate: 'AE 9900 AT',
      model: 'Volkswagen Crafter',
      type: TransportTypeEnum.CAR,
      purchaseDate: '2022-07-21',
      status: TransportStatusEnum.FREE,
      pricePerKmEUR: 0.85,
      capacity: 1600,
      createdAt: new Date().toISOString(),
    },
  ];

  const routeItems = [
    {
      id: randomUUID(),
      startCity: 'Kyiv',
      endCity: 'Lviv',
      distanceKm: 540,
      dispatchDate: new Date('2025-10-22').toISOString(),
      completionDate: null,
      requiredTransportType: TransportTypeEnum.CAR,
      expectedRevenueUSD: 700,
      transportId: null,
      status: RouteStatusEnum.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      startCity: 'Odesa',
      endCity: 'Krakow',
      distanceKm: 1150,
      dispatchDate: new Date('2025-10-18').toISOString(),
      completionDate: null,
      requiredTransportType: TransportTypeEnum.TRUCK,
      expectedRevenueUSD: 2500,
      transportId: transportId1,
      status: RouteStatusEnum.IN_PROGRESS,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      startCity: 'Vinnytsia',
      endCity: 'Prague',
      distanceKm: 1200,
      dispatchDate: new Date('2025-11-05').toISOString(),
      completionDate: null,
      requiredTransportType: TransportTypeEnum.TRUCK,
      expectedRevenueUSD: 2800,
      transportId: null,
      status: RouteStatusEnum.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      startCity: 'Kharkiv',
      endCity: 'Budapest',
      distanceKm: 1450,
      dispatchDate: new Date('2025-09-15').toISOString(),
      completionDate: new Date('2025-09-18').toISOString(),
      requiredTransportType: TransportTypeEnum.TRUCK,
      expectedRevenueUSD: 3100,
      transportId: null,
      status: RouteStatusEnum.COMPLETED,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      startCity: 'Lviv',
      endCity: 'Vienna',
      distanceKm: 700,
      dispatchDate: new Date('2025-10-25').toISOString(),
      completionDate: null,
      requiredTransportType: TransportTypeEnum.TRUCK,
      expectedRevenueUSD: 1600,
      transportId: null,
      status: RouteStatusEnum.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      startCity: 'Zaporizhzhia',
      endCity: 'Chisinau',
      distanceKm: 550,
      dispatchDate: new Date('2025-10-21').toISOString(),
      completionDate: null,
      requiredTransportType: TransportTypeEnum.CAR,
      expectedRevenueUSD: 850,
      transportId: transportId2,
      status: RouteStatusEnum.IN_PROGRESS,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      startCity: 'Kyiv',
      endCity: 'Berlin',
      distanceKm: 1350,
      dispatchDate: new Date('2025-11-10').toISOString(),
      completionDate: null,
      requiredTransportType: TransportTypeEnum.TRUCK,
      expectedRevenueUSD: 3000,
      transportId: null,
      status: RouteStatusEnum.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      startCity: 'Uzhhorod',
      endCity: 'Bratislava',
      distanceKm: 500,
      dispatchDate: new Date('2025-10-30').toISOString(),
      completionDate: null,
      requiredTransportType: TransportTypeEnum.CAR,
      expectedRevenueUSD: 750,
      transportId: transportId2,
      status: RouteStatusEnum.CANCELLED,
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    await Promise.all(
      transportItems.map((item) =>
        db.send(new PutCommand({ TableName: TRANSPORT_TABLE_NAME, Item: item })),
      ),
    );

    await Promise.all(
      routeItems.map((item) =>
        db.send(new PutCommand({ TableName: ROUTES_TABLE_NAME, Item: item })),
      ),
    );
  } catch (error) {
    throw error;
  }
}

seed();
