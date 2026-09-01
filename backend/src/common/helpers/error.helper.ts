import { HttpException, HttpStatus } from '@nestjs/common';

export function ThrowError(
  message: string,
  status: HttpStatus = HttpStatus.BAD_REQUEST,
  data?: unknown,
): never {
  throw new HttpException(
    {
      success: false,
      message,
      ...(data !== undefined && { data }),
    },
    status,
  );
}
