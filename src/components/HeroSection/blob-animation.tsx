import React from 'react';
import "@style/blob-animation.css"

function BlobAnimation() {
	return (
		<div className={"gradient-container"}>
			<div className={"gradient-color"}></div>
			<div className={"gradient-color"}></div>
			<div className={"gradient-color"}></div>
			<div className={"gradient-color"}></div>
			<div className={"gradient-backdrop"}></div>
		</div>
	);
}

export default BlobAnimation;