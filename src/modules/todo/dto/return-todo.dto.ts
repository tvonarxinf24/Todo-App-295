import { ApiProperty } from '@nestjs/swagger';

export class ReturnTodoDto {
  @ApiProperty({ description: 'Todo ID', example: 1 })
  id!: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-01-27T10:15:30.000Z',
    required: false,
  })
  createdAt?: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-27T11:00:00.000Z',
    required: false,
  })
  updatedAt?: string;

  @ApiProperty({
    description: 'Optimistic lock version',
    example: 3,
    required: false,
  })
  version?: number;

  @ApiProperty({
    description: 'User ID who created the todo',
    example: 5,
    required: false,
  })
  createdById?: number;

  @ApiProperty({
    description: 'User ID who last updated the todo',
    example: 5,
    required: false,
  })
  updatedById?: number;

  @ApiProperty({
    description: 'Title of the todo',
    example: 'Buy groceries',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Description of the todo',
    example: 'Milk, Bread, Eggs',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Todo closed status',
    example: false,
    required: false,
  })
  isClosed?: boolean;
}
