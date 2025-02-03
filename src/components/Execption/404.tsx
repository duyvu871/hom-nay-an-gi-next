"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {};
export default function NotFound(props: Props) {
	return (
		<div className="min-h-screen bg-teal-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 text-center">
				<div>
					<h1 className="text-9xl font-extrabold text-teal-600">404</h1>
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						Ối! Không tìm thấy trang
					</h2>
					<p className="mt-2 text-md text-gray-600">
						Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
					</p>
				</div>
				<div>
					<Link
						href="/"
						className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
					>
						Trở về trang chủ
					</Link>
				</div>
			</div>
		</div>
	);
}