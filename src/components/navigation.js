import React from "react";

export const NavigationBar = (props) => {
	return (
		<div>
			<nav className="navbar">
				<div className="container-fluid">
					<span className="navbar-brand m-0 fw-bold text-white">
						<h1>Tack Aid</h1>
					</span>
					<span className="nav-link border rounded-pill bg-light">
						<span id="balance">{props.cUSDBalance}</span>
						cUSD
					</span>
				</div>
			</nav>
		</div>
	);
};
