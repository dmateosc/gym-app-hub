import { BaseEntity } from '@shared/domain/base.entity';

export interface Certification {
  name: string;
  institution: string;
  dateObtained: Date;
  expirationDate?: Date;
  certificateUrl?: string;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
}

export interface Availability {
  monday: AvailabilitySlot[];
  tuesday: AvailabilitySlot[];
  wednesday: AvailabilitySlot[];
  thursday: AvailabilitySlot[];
  friday: AvailabilitySlot[];
  saturday: AvailabilitySlot[];
  sunday: AvailabilitySlot[];
}

export class Trainer extends BaseEntity {
  constructor(
    id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly phone: string,
    public readonly gymId: string,
    public readonly certifications: Certification[],
    public readonly specialties: string[], // ['weight_training', 'cardio', 'nutrition', 'yoga']
    public readonly experience: number, // Años de experiencia
    public readonly bio: string,
    public readonly profileImage?: string,
    public readonly hourlyRate?: number,
    public readonly availability?: Availability,
    public readonly isActive: boolean = true,
  ) {
    super(id);
  }

  public static create(
    email: string,
    name: string,
    phone: string,
    gymId: string,
    certifications: Certification[],
    specialties: string[],
    experience: number,
    bio: string,
    profileImage?: string,
    hourlyRate?: number,
    availability?: Availability,
  ): Trainer {
    const id = this.generateId();
    return new Trainer(
      id,
      email,
      name,
      phone,
      gymId,
      certifications,
      specialties,
      experience,
      bio,
      profileImage,
      hourlyRate,
      availability,
    );
  }

  public hasSpecialty(specialty: string): boolean {
    return this.specialties.includes(specialty.toLowerCase());
  }

  public isAvailableAt(day: string, time: string): boolean {
    if (!this.availability) return false;
    
    const dayAvailability = this.availability[day.toLowerCase()];
    if (!dayAvailability || dayAvailability.length === 0) return false;
    
    const checkTime = new Date(`1970-01-01T${time}`);
    
    return dayAvailability.some(slot => {
      const startTime = new Date(`1970-01-01T${slot.start}`);
      const endTime = new Date(`1970-01-01T${slot.end}`);
      return checkTime >= startTime && checkTime <= endTime;
    });
  }

  public getValidCertifications(): Certification[] {
    const now = new Date();
    return this.certifications.filter(cert => 
      !cert.expirationDate || cert.expirationDate > now
    );
  }

  public getExperienceLevel(): string {
    if (this.experience < 2) return 'junior';
    if (this.experience < 5) return 'mid';
    return 'senior';
  }

  public addCertification(certification: Certification): Trainer {
    const updatedCertifications = [...this.certifications, certification];
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      updatedCertifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      this.isActive,
    );
  }
}
