
import React from 'react';
import { motion } from 'framer-motion';

function GradientBlobs() {
	return (
		<div className="absolute inset-0 overflow-hidden">
			<motion.div
				className="absolute w-[30vw] h-[30vw] rounded-full"
				style={{
					backgroundColor: "var(--primary)",
					filter: "blur(40px)",
					opacity: 0.7,
				}}
				animate={{
					x: [0, 50, -50, 0],
					y: [0, -30, 30, 0],
				}}
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: 20,
					ease: "linear",
				}}
				initial={{ top: "20%", left: "10%" }}
			/>
			<motion.div
				className="absolute w-[35vw] h-[35vw] rounded-full"
				style={{
					backgroundColor: "var(--primary-light)",
					filter: "blur(40px)",
					opacity: 0.7,
				}}
				animate={{
					x: [-30, 40, -40, 30],
					y: [30, -30, 30, -30],
				}}
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: 25,
					ease: "linear",
				}}
				initial={{ top: "40%", right: "15%" }}
			/>
			<motion.div
				className="absolute w-[25vw] h-[25vw] rounded-full"
				style={{
					backgroundColor: "var(--primary-lighter)",
					filter: "blur(40px)",
					opacity: 0.7,
				}}
				animate={{
					x: [20, -40, 40, -20],
					y: [-20, 40, -40, 20],
				}}
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: 22,
					ease: "linear",
				}}
				initial={{ bottom: "20%", left: "30%" }}
			/>
		</div>
	);
}

export default GradientBlobs;