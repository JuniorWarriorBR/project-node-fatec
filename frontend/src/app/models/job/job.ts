import { Empresa } from '../empresa/empresa';

export interface Job {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    companyId: string;
    company: Empresa[]
  }
  