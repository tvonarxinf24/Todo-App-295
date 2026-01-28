import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TodoEntity } from '../entities/todo.entity';

@Injectable()
export class TodoSeedService implements OnApplicationBootstrap {
  /**
   * Logger-Instanz für das TodoSeedService.
   *
   * Wird mit dem Klassennamen initialisiert, um kontextbezogene Logmeldungen
   * für Debugging und Monitoring bereitzustellen.
   *
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger(TodoSeedService.name);

  /**
   * Erzeugt eine neue Instanz und injiziert die benötigten Abhängigkeiten.
   *
   * @param {DataSource} dataSource - Die TypeORM DataSource, die für DB-Operationen verwendet wird.
   */
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Wird ausgeführt, sobald die Anwendung gebootstrapped ist.
   * Hier werden initiale Aufgaben wie das Befüllen der Datenbank ausgeführt.
   *
   * @returns {Promise<void>} - Promise, die aufgelöst wird, wenn die Bootstrap-Logik abgeschlossen ist.
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  /**
   * Befüllt die Datenbank mit anfänglichen Todo-Daten.
   *
   * Diese Methode legt vordefinierte Todo-Einträge an (sofern sie noch nicht existieren)
   * und verwendet dafür das passende Repository.
   *
   * @returns {Promise<void>} - Promise, die aufgelöst wird, wenn das Seeding abgeschlossen ist.
   */
  async seed(): Promise<void> {
    const todoRepo = this.dataSource.getRepository(TodoEntity);
    this.logger.debug(`${this.seed.name}: start`);

    await this.upsertById(
      todoRepo,
      1,
      'OpenAdmin',
      'Example of an open admin todo',
      false,
      1,
      1,
    );
    await this.upsertById(
      todoRepo,
      2,
      'ClosedAdmin',
      'Example of an closed admin todo',
      true,
      1,
      1,
    );
    await this.upsertById(
      todoRepo,
      3,
      'OpenUser',
      'Example of an open user todo',
      false,
      2,
      2,
    );
    await this.upsertById(
      todoRepo,
      4,
      'ClosedUser',
      'Example of a closed user todo',
      true,
      2,
      2,
    );
  }

  /**
   * Fügt einen Todo-Datensatz ein oder überschreibt ihn basierend auf der ID.
   * Existiert der Datensatz bereits, wird keine Änderung durchgeführt.
   *
   * @param {Repository<TodoEntity>} todoRepo - Repository für TodoEntity.
   * @param {number} id - Die eindeutige ID des Todos.
   * @param {string} title - Der Titel des Todos.
   * @param {string} description - Die Beschreibung des Todos.
   * @param {boolean} isClosed - Gibt an, ob das Todo geschlossen ist.
   * @param {number} createdById - ID des Benutzers, der das Todo erstellt hat.
   * @param {number} updatedById - ID des Benutzers, der das Todo zuletzt aktualisiert hat.
   * @returns {Promise<void>} - Promise, die aufgelöst wird, wenn Einfügen/Aktualisieren abgeschlossen ist.
   */
  private async upsertById(
    todoRepo: Repository<TodoEntity>,
    id: number,
    title: string,
    description: string,
    isClosed: boolean,
    createdById: number,
    updatedById: number,
  ): Promise<void> {
    this.logger.verbose(
      `${this.upsertById.name}: id=${id}, title=${title}, description=${description}, isClosed=${isClosed} createdById=${createdById}, updatedById=${updatedById}`,
    );

    await todoRepo.upsert(
      {
        id,
        title,
        description,
        isClosed,
        createdById,
        updatedById,
      },
      ['id'],
    );
  }
}
