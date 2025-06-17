import { DomainException } from '../../../shared/domain/domain.exception';

export class InvalidWorkoutPlanException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_WORKOUT_PLAN');
  }
}
