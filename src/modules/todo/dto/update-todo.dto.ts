import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({
    description: 'Title of the todo',
    example: 'Buy groceries',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(8, 50)
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
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}
