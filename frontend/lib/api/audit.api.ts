import { axiosInstance } from './axiosInstance';
import {
  AuditInputDto,
  AuditReportDto,
  CaptureLeadDto,
  PersistedAuditResultDto,
} from '@/types/audit.types';

export const auditApi = {
  analyzeStack: async (
    payload: AuditInputDto,
  ): Promise<PersistedAuditResultDto> => {
    const response = await axiosInstance.post<PersistedAuditResultDto>(
      '/audit/analyze',
      payload,
    );
    return response.data;
  },

  getAuditBySlug: async (shareSlug: string): Promise<AuditReportDto> => {
    const response = await axiosInstance.get<AuditReportDto>(
      `/audit/share/${shareSlug}`,
    );
    return response.data;
  },

  captureLead: async (payload: CaptureLeadDto): Promise<{ success: boolean }> => {
    const response = await axiosInstance.post<{ success: boolean }>(
      '/audit/lead',
      payload,
    );
    return response.data;
  },
};
