import React, { useState } from "react";
import styles from "./ProductCard.module.css";
import { ethers } from "ethers";
import DefaultImg from "../../assets/defaultProductImg.png";
function timeout(delay) {
	return new Promise((res) => setTimeout(res, delay));
}
function ProductCard(props) {
	const [loading, setLoading] = useState(false);

	const handlePurchaseProduct = async () => {
		setLoading(true);
		await props.ecommerce.functions.purchaseProduct(props.product.id, {
			value: props.product.price,
		});
		await timeout(3000);
		setLoading(false);
		window.location.reload(false);
		props.handleToastShowOpen();
		props.toggleRefresh();
	};
	return (
		<div className={`col-lg-3 col-md-3 col-sm-4 col-xs-6 ${styles.container}`}>
			<div className="card h-100">
				<img
					src={`https://ipfs.infura.io/ipfs/${props.product.image}`}
					className={`card-img-top ${styles.topImg}`}
					alt="product"
					onError={(e) => {
						e.target.onerror = null; // prevents looping
						e.target.src = `${DefaultImg}`;
					}}
				/>
				<div className="card-body">
					<h5 className="card-title">{props.product?.name}</h5>
					<p className="card-text">
						Price : {ethers.utils.formatEther(props.product.price.toString())}{" "}
						ETH
					</p>
					<p className="card-text">
						Owner :{" "}
						{props.product.owner.slice(0, 5) +
							"..." +
							props.product.owner.slice(38, 42)}
					</p>
				</div>
				{props.showBtn && (
					<div className="card-footer">
						{props.product.purchased ? (
							<button type="button" className="btn btn-primary disabled w-100">
								Purchased
							</button>
						) : (
							<button
								type="button"
								className="btn btn-primary w-100"
								onClick={handlePurchaseProduct}
							>
								{loading ? "Loading...." : "Buy"}
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default ProductCard;
