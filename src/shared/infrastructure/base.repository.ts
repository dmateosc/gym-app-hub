export abstract class BaseRepository<T> {
  abstract save(entity: T): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract delete(id: string): Promise<void>;
}