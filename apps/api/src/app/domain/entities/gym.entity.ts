import { BaseEntity } from '@shared/domain/base.entity';

export class Gym extends BaseEntity {
  constructor(
    id: string,
    public readonly name: string,
    public readonly address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    },
    public readonly phone: string,
    public readonly email: string,
    public readonly operatingHours: {
      monday: { open: string; close: string; isClosed: boolean };
      tuesday: { open: string; close: string; isClosed: boolean };
      wednesday: { open: string; close: string; isClosed: boolean };
      thursday: { open: string; close: string; isClosed: boolean };
      friday: { open: string; close: string; isClosed: boolean };
      saturday: { open: string; close: string; isClosed: boolean };
      sunday: { open: string; close: string; isClosed: boolean };
    },
    public readonly facilities: string[],
    public readonly maxCapacity: number,
    public readonly isActive: boolean = true,
  ) {
    super(id);
  }

  public static create(
    name: string,
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    },
    phone: string,
    email: string,
    operatingHours: {
      monday: { open: string; close: string; isClosed: boolean };
      tuesday: { open: string; close: string; isClosed: boolean };
      wednesday: { open: string; close: string; isClosed: boolean };
      thursday: { open: string; close: string; isClosed: boolean };
      friday: { open: string; close: string; isClosed: boolean };
      saturday: { open: string; close: string; isClosed: boolean };
      sunday: { open: string; close: string; isClosed: boolean };
    },
    facilities: string[],
    maxCapacity: number,
  ): Gym {
    const id = this.generateId();
    return new Gym(
      id,
      name,
      address,
      phone,
      email,
      operatingHours,
      facilities,
      maxCapacity,
    );
  }

  public isWithinCapacity(currentUsers: number): boolean {
    return currentUsers < this.maxCapacity;
  }

  public isOpenAt(day: string, time: string): boolean {
    const daySchedule =
      this.operatingHours[
        day.toLowerCase() as keyof typeof this.operatingHours
      ];
    if (daySchedule?.isClosed) return false;
    
    const currentTime = new Date(`1970-01-01T${time}`);
    const openTime = new Date(`1970-01-01T${daySchedule.open}`);
    const closeTime = new Date(`1970-01-01T${daySchedule.close}`);
    
    return currentTime >= openTime && currentTime <= closeTime;
  }
}
