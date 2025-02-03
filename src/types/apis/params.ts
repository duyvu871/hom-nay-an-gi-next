export type FilterParams = {
	branchId: string;
	page: number;
	limit: number;
	search?: string; // search by fts
	searchFields?: string; // name:abc, name:def
	orderBy?: string; // created_at:desc, created_at:asc
	filterBy?: string; // status:1, status:0
}

export type PaginationFilterParams = {
	page: number;
	limit: number;
	search?: string; // search by fts
	searchFields?: string; // name:abc, name:def
	orderBy?: string; // created_at:desc, created_at:asc
	filterBy?: string; // status:1, status:0
}