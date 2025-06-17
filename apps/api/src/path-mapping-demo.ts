// Test file to demonstrate path mapping is working
import { WorkoutPlan } from '@entities/workout-plan.entity';
import { WorkoutPlanRepository } from '@repositories/workout-plan.repository.interface';
import { WorkoutPlanService } from '@services/workout-plan.service';
import { WorkoutPlanNotFoundException } from '@exceptions/workout-plan-not-found.exception';

// This file demonstrates that the @ path mappings are working correctly
// If these imports resolve without "Cannot find module" errors, 
// then the path mapping configuration is successful

export class PathMappingDemo {
  // These type annotations will work if path mapping is configured correctly
  private workoutPlan: WorkoutPlan;
  private repository: WorkoutPlanRepository;
  private service: WorkoutPlanService;
  private exception: WorkoutPlanNotFoundException;

  constructor() {
    // This is just a demo - not meant to be functional
    console.log('Path mapping is working correctly!');
  }
}
