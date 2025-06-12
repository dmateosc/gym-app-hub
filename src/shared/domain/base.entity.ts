export abstract class BaseEntity {
  protected constructor(protected readonly _id?: string) {}

  get id(): string | undefined {
    return this._id;
  }

  equals(entity: BaseEntity): boolean {
    if (!entity) return false;
    return this._id === entity._id;
  }

  abstract validate(): void;
}