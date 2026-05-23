import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  OpeningImportCleanupSoftDeletedResultDto,
  OpeningImportCommitResultDto,
  OpeningImportPreviewRequestDto,
  OpeningImportPreviewResponseDto,
} from '../types/opening-import-types';

function ensureSuccess<T>(response: ApiResponse<T>, fallback: string): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message || fallback);
  }

  return response.data;
}

export const openingImportApi = {
  preview: async (payload: OpeningImportPreviewRequestDto): Promise<OpeningImportPreviewResponseDto> => {
    const response = await api.post<ApiResponse<OpeningImportPreviewResponseDto>>('/api/aqua/OpeningImport/preview', payload);
    return ensureSuccess(response, 'Preview failed.');
  },

  getById: async (id: number): Promise<OpeningImportPreviewResponseDto> => {
    const response = await api.get<ApiResponse<OpeningImportPreviewResponseDto>>(`/api/aqua/OpeningImport/${id}`);
    return ensureSuccess(response, 'Import job could not be loaded.');
  },

  commit: async (id: number): Promise<OpeningImportCommitResultDto> => {
    const response = await api.post<ApiResponse<OpeningImportCommitResultDto>>(`/api/aqua/OpeningImport/${id}/commit`);
    return ensureSuccess(response, 'Commit failed.');
  },

  cleanupSoftDeleted: async (id: number): Promise<OpeningImportCleanupSoftDeletedResultDto> => {
    const response = await api.post<ApiResponse<OpeningImportCleanupSoftDeletedResultDto>>(`/api/aqua/OpeningImport/${id}/cleanup-soft-deleted`);
    return ensureSuccess(response, 'Soft-deleted test records could not be cleaned.');
  },
};
