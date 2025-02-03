export interface UploadResponse {
	id: string
	store_id: string
	asset_id: string
	product_id: any
	createdAt: string
	updatedAt: string
	asset: Asset
}

export interface Asset {
	id: string
	store_id: string
	path: string
	name: string
	description: string
	url: string
	type: string
	meta_data: MetaData
	from: string
	createdAt: string
	updatedAt: string
}

export interface MetaData {
	mime: string
	size: number
	originalName: string
	encoding: string
	destination: string
}
