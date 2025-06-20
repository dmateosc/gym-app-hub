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
    public readonly specialties: string[],
    public readonly experience: number,
    public readonly bio: string,
    public readonly profileImage?: string,
    public readonly hourlyRate?: number,
    public readonly availability?: Availability,
    public readonly isActive: boolean = true,
    public readonly rating: number = 0,
    public readonly totalClients: number = 0,
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

  public static restore(
    id: string,
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
    isActive?: boolean,
    rating?: number,
    totalClients?: number,
  ): Trainer {
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
      isActive ?? true,
      rating ?? 0,
      totalClients ?? 0,
    );
  }

  // Computed properties for backward compatibility
  public get firstName(): string {
    return this.name.split(' ')[0] || '';
  }

  public get lastName(): string {
    const parts = this.name.split(' ');
    return parts.slice(1).join(' ') || '';
  }

  public get specializations(): string[] {
    return this.specialties;
  }

  public get profilePicture(): string | undefined {
    return this.profileImage;
  }

  // Core business methods
  public hasSpecialty(specialty: string): boolean {
    return this.specialties.includes(specialty.toLowerCase());
  }

  public isAvailableAt(day: string, time: string): boolean {
    if (!this.availability) return false;

    const dayAvailability =
      this.availability[day.toLowerCase() as keyof Availability];
    if (!dayAvailability || dayAvailability.length === 0) return false;

    const checkTime = new Date(`1970-01-01T${time}`);

    return dayAvailability.some(slot => {
      const startTime = new Date(`1970-01-01T${slot.start}`);
      const endTime = new Date(`1970-01-01T${slot.end}`);
      return checkTime >= startTime && checkTime <= endTime;
    });
  }

  public isAvailable(day: string, startTime: string, endTime: string): boolean {
    if (!this.availability) return false;

    const dayAvailability =
      this.availability[day.toLowerCase() as keyof Availability];
    if (!dayAvailability || dayAvailability.length === 0) return false;

    const requestStart = new Date(`1970-01-01T${startTime}`);
    const requestEnd = new Date(`1970-01-01T${endTime}`);

    return dayAvailability.some(slot => {
      const slotStart = new Date(`1970-01-01T${slot.start}`);
      const slotEnd = new Date(`1970-01-01T${slot.end}`);
      return requestStart >= slotStart && requestEnd <= slotEnd;
    });
  }

  public getValidCertifications(): Certification[] {
    const now = new Date();
    return this.certifications.filter(
      cert => !cert.expirationDate || cert.expirationDate > now,
    );
  }

  public getExperienceLevel(): string {
    if (this.experience < 2) return 'junior';
    if (this.experience < 5) return 'mid';
    return 'senior';
  }

  // Simplified update methods - return new instances
  public update(
    updates: Partial<{
      name: string;
      phone: string;
      specialties: string[];
      experience: number;
      hourlyRate: number;
      bio: string;
      profileImage: string;
      availability: Availability;
      isActive: boolean;
    }>,
  ): Trainer {
    return new Trainer(
      this.id,
      this.email,
      updates.name ?? this.name,
      updates.phone ?? this.phone,
      this.gymId,
      this.certifications,
      updates.specialties ?? this.specialties,
      updates.experience ?? this.experience,
      updates.bio ?? this.bio,
      updates.profileImage ?? this.profileImage,
      updates.hourlyRate ?? this.hourlyRate,
      updates.availability ?? this.availability,
      updates.isActive ?? this.isActive,
      this.rating,
      this.totalClients,
    );
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
      this.rating,
      this.totalClients,
    );
  }

  public removeCertification(certificationName: string): Trainer {
    const updatedCertifications = this.certifications.filter(
      cert => cert.name !== certificationName,
    );
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
      this.rating,
      this.totalClients,
    );
  }

  // Legacy method support for existing code
  public updateFirstName(firstName: string): Trainer {
    const lastName = this.lastName;
    const newName = lastName ? `${firstName} ${lastName}` : firstName;
    return this.update({ name: newName });
  }

  public updateLastName(lastName: string): Trainer {
    const firstName = this.firstName;
    const newName = firstName ? `${firstName} ${lastName}` : lastName;
    return this.update({ name: newName });
  }

  public updatePhone(phone: string): Trainer {
    return this.update({ phone });
  }

  public updateSpecializations(specializations: string[]): Trainer {
    return this.update({ specialties: specializations });
  }

  public updateExperience(experience: number): Trainer {
    return this.update({ experience });
  }

  public updateHourlyRate(hourlyRate: number): Trainer {
    return this.update({ hourlyRate });
  }

  public updateAvailability(availability: Availability): Trainer {
    return this.update({ availability });
  }

  public updateBio(bio: string): Trainer {
    return this.update({ bio });
  }

  public updateProfilePicture(profilePicture: string): Trainer {
    return this.update({ profileImage: profilePicture });
  }

  public activate(): Trainer {
    return this.update({ isActive: true });
  }

  public deactivate(): Trainer {
    return this.update({ isActive: false });
  }

  public updateRating(newRating: number): Trainer {
    // For now, just return the same trainer - in a real implementation,
    // you'd calculate the new average rating
    return this;
  }

  public incrementClientCount(): Trainer {
    return this;
  }

  public decrementClientCount(): Trainer {
    return this;
  }

  public updateDayAvailability(
    day: string,
    isAvailable: boolean,
    startTime?: string,
    endTime?: string,
  ): Trainer {
    if (!this.availability) return this;

    const newAvailability = { ...this.availability };
    const dayKey = day.toLowerCase() as keyof Availability;

    if (isAvailable && startTime && endTime) {
      newAvailability[dayKey] = [{ start: startTime, end: endTime }];
    } else {
      newAvailability[dayKey] = [];
    }

    return this.update({ availability: newAvailability });
  }
}
