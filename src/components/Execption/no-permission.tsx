'use client'

import { useRouter } from 'next/navigation'

export default function NoPermission() {
	const router = useRouter()

	return (
		<div className="h-full bg-teal-50 flex flex-col items-center justify-center px-4">
			<div className="max-w-md w-full text-center">
				<h1 className="text-6xl font-bold text-teal-600 mb-4">403</h1>
				<h2 className="text-2xl font-semibold text-teal-800 mb-4">
					Không có quyền truy cập
				</h2>
				<p className="text-gray-600 mb-8">
					Xin lỗi, bạn không có quyền truy cập vào tài nguyên này.
				</p>
				<button
					onClick={() => router.back()}
					className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
				>
					Quay lại trang trước
				</button>
			</div>
		</div>
	)
}

