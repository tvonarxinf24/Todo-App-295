import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import TodoService from '../services/todo.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CorrId } from '../../../decorators/corr-id.decorator';
import { IsAdmin, UserId } from '../../auth/decorators';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import {
  CreateTodoDto,
  ReplaceTodoDto,
  ReturnTodoDto,
  UpdateTodoAdminDto,
} from '../dto';

@Controller('todo')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiInternalServerErrorResponse({
  description:
    'Internal Server Error\n\n[Referenz zu HTTP 500](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/500)',
})
@ApiUnauthorizedResponse({
  description:
    'Unauthorized, the user must be signed in\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
})
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Patch(':id/admin')
  async updateByAdmin(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateToDoAdminDto: UpdateTodoAdminDto,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.todoService.updateByAdmin(
      corrId,
      isAdmin,
      userId,
      id,
      updateToDoAdminDto,
    );
  }

  @Post()
  @ApiBody({ type: CreateTodoDto })
  create(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<ReturnTodoDto> {
    return this.todoService.create(corrId, userId, createTodoDto);
  }

  @Get()
  findAll(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.todoService.findAll(corrId, isAdmin, userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  findOne(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
    @UserId() userId: number,
  ) {
    return this.todoService.findOne(corrId, userId, isAdmin, id);
  }

  @Put(':id')
  async replace(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() replaceTodoDto: ReplaceTodoDto,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.todoService.replace(
      corrId,
      isAdmin,
      userId,
      id,
      replaceTodoDto,
    );
  }

  @Patch(':id')
  async update(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(corrId, userId, id, updateTodoDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  remove(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.todoService.remove(corrId, isAdmin, id);
  }
}
