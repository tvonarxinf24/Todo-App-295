import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import TodoService from './todo.service';
import { TodoEntity } from '../entities/todo.entity';
import {
  CreateTodoDto,
  UpdateTodoDto,
  UpdateTodoAdminDto,
  ReturnTodoDto,
} from '../dto';

type RepoMock = {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOneBy: jest.Mock;
  remove: jest.Mock;
};

describe('TodoService', () => {
  let service: TodoService;
  let repo: RepoMock;

  const corrId = 1;
  const userId = 1;
  const adminId = 99;

  const baseTodo = {
    id: 1,
    title: 'Todo',
    description: 'Desc',
    isClosed: false,
    version: 1,
    createdById: userId,
    updatedById: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as TodoEntity;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const dto: CreateTodoDto = { title: 'New', description: 'Desc' };
      repo.create.mockReturnValue(baseTodo);
      repo.save.mockResolvedValue(baseTodo);

      const result = await service.create(corrId, userId, dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          title: 'Todo',
          createdById: userId,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all todos for admin', async () => {
      repo.find.mockResolvedValue([baseTodo]);

      const result = await service.findAll(corrId, true, userId);

      expect(repo.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should return only open todos for user', async () => {
      repo.find.mockResolvedValue([baseTodo]);

      const result = await service.findAll(corrId, false, userId);

      expect(repo.find).toHaveBeenCalledWith({
        where: { createdById: userId, isClosed: false },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return todo for owner', async () => {
      repo.findOneBy.mockResolvedValue(baseTodo);

      const result = await service.findOne(corrId, userId, false, 1);

      expect(result.id).toBe(1);
    });

    it('should allow admin to read foreign todo', async () => {
      repo.findOneBy.mockResolvedValue({ ...baseTodo, createdById: 999 });

      const result = await service.findOne(corrId, userId, true, 1);

      expect(result.id).toBe(1);
    });

    it('should throw ForbiddenException for foreign user', async () => {
      repo.findOneBy.mockResolvedValue({ ...baseTodo, createdById: 999 });

      await expect(service.findOne(corrId, userId, false, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(corrId, userId, false, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should allow owner to close todo', async () => {
      repo.findOneBy.mockResolvedValue(baseTodo);
      repo.save.mockResolvedValue({ ...baseTodo, isClosed: true });

      const result = await service.update(corrId, false, userId, 1, {
        isClosed: true,
      } as UpdateTodoDto);

      expect(result.isClosed).toBe(true);
    });

    it('should forbid user to open todo with opening rule', async () => {
      repo.findOneBy.mockResolvedValue({
        ...baseTodo,
        createdById: userId,
        isClosed: true,
      });

      await expect(
        service.update(corrId, false, userId, 1, {
          isClosed: false,
        } as UpdateTodoDto),
      ).rejects.toThrow('Opening todos is not allowed');

      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should forbid foreign user', async () => {
      repo.findOneBy.mockResolvedValue({ ...baseTodo, createdById: 999 });

      await expect(
        service.update(corrId, false, userId, 1, { title: 'X' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to update foreign todo', async () => {
      repo.findOneBy.mockResolvedValue({ ...baseTodo, createdById: 999 });
      repo.save.mockResolvedValue({ ...baseTodo, title: 'Admin update' });

      const result = await service.update(corrId, true, adminId, 1, {
        title: 'Admin update',
      });

      expect(result.title).toBe('Admin update');
    });

    it('should allow admin to open a closed todo', async () => {
      repo.findOneBy.mockResolvedValue({ ...baseTodo, isClosed: true });
      repo.save.mockResolvedValue({
        ...baseTodo,
        isClosed: false,
        updatedById: adminId,
      });

      const result = await service.update(corrId, true, adminId, 1, {
        isClosed: false,
      } as UpdateTodoDto);

      expect(repo.save).toHaveBeenCalled();
      expect(result.isClosed).toBe(false);
    });

    it('should throw NotFoundException if todo not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(corrId, false, userId, 999, { title: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateByAdmin', () => {
    it('should update todo as admin', async () => {
      repo.findOneBy.mockResolvedValue(baseTodo);
      repo.save.mockResolvedValue({
        ...baseTodo,
        isClosed: true,
        updatedById: adminId,
      });

      const result = await service.updateByAdmin(corrId, true, adminId, 1, {
        isClosed: true,
      } as UpdateTodoAdminDto);

      expect(result.isClosed).toBe(true);
    });

    it('should throw ForbiddenException if not admin', async () => {
      repo.findOneBy.mockResolvedValue(baseTodo);

      await expect(
        service.updateByAdmin(corrId, false, userId, 1, {
          isClosed: true,
        } as UpdateTodoAdminDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if todo not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateByAdmin(corrId, true, adminId, 999, {
          isClosed: true,
        } as UpdateTodoAdminDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('replace', () => {
    it('should replace todo when version matches', async () => {
      repo.findOneBy.mockResolvedValue(baseTodo);
      repo.save.mockResolvedValue({ ...baseTodo, title: 'Replaced' });

      const result = await service.replace(corrId, true, adminId, 1, {
        ...baseTodo,
      } as ReturnTodoDto);

      expect(result.title).toBe('Replaced');
    });

    it('should throw ConflictException on version mismatch', async () => {
      repo.findOneBy.mockResolvedValue({ ...baseTodo, version: 2 });

      await expect(
        service.replace(corrId, true, adminId, 1, {
          ...baseTodo,
          version: 1,
        } as ReturnTodoDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ForbiddenException if not admin', async () => {
      repo.findOneBy.mockResolvedValue(baseTodo);

      await expect(
        service.replace(corrId, false, userId, 1, {
          ...baseTodo,
        } as ReturnTodoDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if todo not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(
        service.replace(corrId, true, adminId, 999, {} as ReturnTodoDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove todo as admin', async () => {
      repo.findOneBy.mockResolvedValue(baseTodo);
      repo.save.mockResolvedValue(baseTodo);
      repo.remove.mockResolvedValue(baseTodo);

      const result = await service.remove(corrId, true, adminId, 1);

      expect(repo.remove).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('should throw ForbiddenException if not admin', async () => {
      repo.findOneBy.mockResolvedValue(baseTodo);

      await expect(service.remove(corrId, false, userId, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if todo not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(corrId, true, adminId, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
