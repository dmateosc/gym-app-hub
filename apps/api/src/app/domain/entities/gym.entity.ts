import { BaseEntity } from '@shared/domain/base.entity';

// Parameter objects for clean code
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface DaySchedule {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface CreateGymParams {
  name: string;
  address: Address;
  phone: string;
  email: string;
  operatingHours: OperatingHours;
  facilities: string[];
  maxCapacity: number;
}

export interface UpdateGymParams {
  name?: string;
  address?: Address;
  phone?: string;
  email?: string;
  operatingHours?: OperatingHours;
  facilities?: string[];
  maxCapacity?: number;
  isActive?: boolean;
}

export class Gym extends BaseEntity {
  constructor(
    id: string,
    public readonly name: string,
    public readonly address: Address,
    public readonly phone: string,
    public readonly email: string,
    public readonly operatingHours: OperatingHours,
    public readonly facilities: string[],
    public readonly maxCapacity: number,
    public readonly isActive: boolean = true,
  ) {
    super(id);
  }

  public static create(params: CreateGymParams): Gym {
    const id = this.generateId();
    return new Gym(
      id,
      params.name,
      params.address,
      params.phone,
      params.email,
      params.operatingHours,
      params.facilities,
      params.maxCapacity,
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
