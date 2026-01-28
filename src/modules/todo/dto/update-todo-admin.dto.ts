import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTodoAdminDto {
  @ApiProperty({
    description: 'Close or reopen a todo',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isClosed!: boolean;
}
