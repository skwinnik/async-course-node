export interface IPageRequest {
    offset: number;
    limit: number;
    sort: { by: string; order: 'asc' | 'desc' };
  }
  