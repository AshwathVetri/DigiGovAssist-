import { Application, ApplicationStatus } from '../../types';

export interface ApplicationServiceProvider {
  getApplicationsForUser(userId: string): Promise<Application[]>;
  getApplicationById(id: string): Promise<Application | null>;
  createApplication(draft: Partial<Application>): Promise<Application>;
  updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application | null>;
  markApplicationAsPaid(id: string, paymentId: string, amount: number): Promise<Application | null>;
  deleteApplication(id: string): Promise<boolean>;
}
