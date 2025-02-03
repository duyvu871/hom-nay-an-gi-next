"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NotFound from '@component/Execption/404.tsx';

type Props = {};
export default function Page(props: Props) {
	return (
		<NotFound />
	);
}