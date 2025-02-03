"use client"

import React from 'react';
import { motion } from 'framer-motion';
import GradientBlobs from '@component/HeroSection/gradient-blobs.tsx';

export type GradientLayoutProps = {
	// Add your props here
	children: React.ReactNode;
};

function GradientLayout({ children }: GradientLayoutProps) {
	return (
		<div className="relative min-h-svh flex flex-col bg-white overflow-hidden">
			{/* Gradient Blobs */}
			<GradientBlobs />
			{/* Content */}
			{children}
		</div>
	);
}

export default GradientLayout;