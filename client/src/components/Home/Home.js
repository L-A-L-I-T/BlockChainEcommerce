import React, { useState, useEffect } from "react";

import Navbar from "../Navbar/Navbar";
import Products from "../Products/Products";
import { Toast, Alert, ToastContainer } from "react-bootstrap";
function Home(props) {
	const [toastShow, setToastShow] = useState(false);
	const handleToastShowOpen = () => setToastShow(true);
	const handleToastShowClose = () => {
		setToastShow(false);
		props.toggleRefresh();
	};
	// console.log(products);

	return (
		<div>
			<ToastContainer className="p-3" position="top-end">
				<Toast
					show={toastShow}
					onClose={handleToastShowClose}
					delay={6000}
					autohide
				>
					<Alert variant="success">
						<h5>Product Purchased Successfully</h5>
						<p>It might take few minutes to reflect in our app</p>
						<p>Refresh if needed</p>
					</Alert>
				</Toast>
			</ToastContainer>
			<Navbar
				loading={props.loading}
				account={props.account}
				ecommerce={props.ecommerce}
				setLoading={props.setLoading}
				productCount={props.productCount}
				toggleRefresh={props.toggleRefresh}
			/>
			{props.loading && <div>Loading....</div>}

			<Products
				loading={props.loading}
				productCount={props.productCount}
				products={props.products}
				account={props.account}
				ecommerce={props.ecommerce}
				setLoading={props.setLoading}
				handleToastShowOpen={handleToastShowOpen}
				toggleRefresh={props.toggleRefresh}
				showBtn={true}
				balance={props.balance}
			/>
		</div>
	);
}

export default Home;
