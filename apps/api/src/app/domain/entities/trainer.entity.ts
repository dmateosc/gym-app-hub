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

  // Add missing methods for trainer management
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
    firstName?: string,
    lastName?: string,
    profilePicture?: string,
    specializations?: string[],
  ): Trainer {
    return new Trainer(
      id,
      email,
      firstName && lastName ? `${firstName} ${lastName}` : name,
      phone,
      gymId,
      certifications,
      specializations || specialties,
      experience,
      bio,
      profilePicture || profileImage,
      hourlyRate,
      availability,
      isActive ?? true,
    );
  }

  // Property getters for backward compatibility
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

  public get rating(): number {
    return 0; // Placeholder - should be calculated from reviews
  }

  public get totalClients(): number {
    return 0; // Placeholder - should be calculated from assignments
  }

  // Update methods
  public updateFirstName(firstName: string): Trainer {
    const lastName = this.lastName;
    const newName = lastName ? `${firstName} ${lastName}` : firstName;
    return new Trainer(
      this.id,
      this.email,
      newName,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      this.isActive,
    );
  }

  public updateLastName(lastName: string): Trainer {
    const firstName = this.firstName;
    const newName = firstName ? `${firstName} ${lastName}` : lastName;
    return new Trainer(
      this.id,
      this.email,
      newName,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      this.isActive,
    );
  }

  public updatePhone(phone: string): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      this.isActive,
    );
  }

  public updateSpecializations(specializations: string[]): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      specializations,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      this.isActive,
    );
  }

  public updateExperience(experience: number): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      this.isActive,
    );
  }

  public updateHourlyRate(hourlyRate: number): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      hourlyRate,
      this.availability,
      this.isActive,
    );
  }

  public updateAvailability(availability: Availability): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      availability,
      this.isActive,
    );
  }

  public updateBio(bio: string): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      this.isActive,
    );
  }

  public updateProfilePicture(profilePicture: string): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      profilePicture,
      this.hourlyRate,
      this.availability,
      this.isActive,
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
    );
  }

  public updateRating(newRating: number): Trainer {
    // For now, just return the same trainer
    // In a real implementation, you'd calculate the new average rating
    return this;
  }

  public incrementClientCount(): Trainer {
    // For now, just return the same trainer
    // In a real implementation, you'd track client count
    return this;
  }

  public decrementClientCount(): Trainer {
    // For now, just return the same trainer
    // In a real implementation, you'd track client count
    return this;
  }

  public activate(): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      true,
    );
  }

  public deactivate(): Trainer {
    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      this.availability,
      false,
    );
  }

  public updateDayAvailability(
    day: string,
    isAvailable: boolean,
    startTime?: string,
    endTime?: string,
  ): Trainer {
    if (!this.availability) return this;

    const newAvailability = { ...this.availability };
    if (isAvailable && startTime && endTime) {
      newAvailability[day.toLowerCase()] = [{ start: startTime, end: endTime }];
    } else {
      newAvailability[day.toLowerCase()] = [];
    }

    return new Trainer(
      this.id,
      this.email,
      this.name,
      this.phone,
      this.gymId,
      this.certifications,
      this.specialties,
      this.experience,
      this.bio,
      this.profileImage,
      this.hourlyRate,
      newAvailability,
      this.isActive,
    );
  }

  public isAvailable(day: string, startTime: string, endTime: string): boolean {
    if (!this.availability) return false;

    const dayAvailability =
      this.availability[day.toLowerCase() as keyof Availability];
    if (!dayAvailability || dayAvailability.length === 0) return false;

    const requestStart = new Date(`1970-01-01T${startTime}`);
    const requestEnd = new Date(`1970-01-01T${endTime}`);

    return dayAvailability.some((slot: AvailabilitySlot) => {
      const slotStart = new Date(`1970-01-01T${slot.start}`);
      const slotEnd = new Date(`1970-01-01T${slot.end}`);
      return requestStart >= slotStart && requestEnd <= slotEnd;
    });
  }
}
