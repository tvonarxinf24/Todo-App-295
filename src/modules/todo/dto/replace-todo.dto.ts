import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class ReplaceTodoDto {
  @ApiProperty({ description: 'Todo ID', example: 1 })
  @IsInt()
  id!: number;

  @ApiProperty({
    description: 'Version for optimistic locking',
    example: 2,
  })
  @IsInt()
  version!: number;

  @ApiProperty({
    description: 'Title of the todo',
    example: 'Buy groceries',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description of the todo',
    example: 'Milk, Bread, Eggs',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Todo closed status',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}
