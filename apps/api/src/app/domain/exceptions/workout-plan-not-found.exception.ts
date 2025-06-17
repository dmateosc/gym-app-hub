import { DomainException } from '../../../shared/domain/domain.exception';

export class WorkoutPlanNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Workout plan with id ${id} not found`, 'WORKOUT_PLAN_NOT_FOUND');
  }
}
