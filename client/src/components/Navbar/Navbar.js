import React, { useEffect, useState, useRef } from "react";
import styles from "./Navbar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import ListProduct from "../ListProduct/ListProduct.js";
import {
	OverlayTrigger,
	Tooltip,
	Button,
	Toast,
	Alert,
	ToastContainer,
} from "react-bootstrap";
export default function Navbar(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [toastShow, setToastShow] = useState(false);
	const handleToastShowOpen = () => setToastShow(true);
	const handleToastShowClose = () => {
		setToastShow(false);
		window.location.reload(false);
		props.toggleRefresh();
	};
	let location = useLocation();
	return (
		<div className={styles.container}>
			<ToastContainer className="p-3" position="top-end">
				<Toast
					show={toastShow}
					onClose={handleToastShowClose}
					delay={6000}
					autohide
				>
					<Alert variant="success">
						<h5>Product Added Successfully</h5>
						<p>It might take few minutes to reflect in our app</p>
						<p>Refresh if needed</p>
					</Alert>
				</Toast>
			</ToastContainer>
			<NavLink to="/" className={styles.logoBtn}>
				{"BlockChainCommerce".toUpperCase()}
			</NavLink>
			<div className={styles.rightContainer}>
				<NavLink
					type="button"
					className={styles.listBtn}
					to="/myproducts"
					style={
						location.pathname == "/myproducts"
							? {
									color: "#0a58ca",
							  }
							: {}
					}
				>
					My Products
				</NavLink>
				<button
					type="button"
					data-bs-toggle="modal"
					data-bs-target="#exampleModal"
					className={styles.listBtn}
					onClick={handleShow}
				>
					List Product
				</button>
				<OverlayTrigger
					placement="bottom"
					overlay={<Tooltip id={`tooltip-bottom`}>{props.account}</Tooltip>}
				>
					<Button variant="outline-primary">
						{props.account?.slice(0, 5) + "..." + props.account?.slice(38, 42)}
					</Button>
				</OverlayTrigger>
			</div>
			<ListProduct
				show={show}
				handleClose={handleClose}
				loading={props.loading}
				account={props.account}
				ecommerce={props.ecommerce}
				setLoading={props.setLoading}
				productCount={props.productCount}
				handleToastShowOpen={handleToastShowOpen}
				toggleRefresh={props.toggleRefresh}
			/>
		</div>
	);
}
