import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { logger } from 'src/lib/logger';

export const validateAndTransform = async <T extends object>(
  dtoClass: ClassConstructor<T>,
  data: any,
): Promise<T> => {
  const instance = plainToInstance(dtoClass, data || {});

  const errors = await validate(instance);

  if (errors.length > 0) {
    logger.error('Validation failed for input data', { errors, data });
    throw new Error(
      JSON.stringify({
        statusCode: 400,
        message: 'Invalid input parameters.',
        details: errors.map((error) => Object.values(error.constraints)).flat(),
      }),
    );
  }

  return instance;
};
