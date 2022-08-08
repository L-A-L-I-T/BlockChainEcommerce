import React from "react";
import ProductCard from "./ProductCard";
import styles from "./Products.module.css";
function Products(props) {
	return (
		<div>
			<div className={styles.topContainer}>
				<div>Products({props.productCount})</div>
				<div>Balance : {props.balance} ETH</div>
			</div>
			<div className={`container-fluid ${styles.innerContainer}`}>
				<div className={`row justify-content-start`}>
					{props.products.map((product, index) => {
						return !product.purchased ? (
							<ProductCard
								product={product}
								key={index}
								account={props.account}
								ecommerce={props.ecommerce}
								setLoading={props.setLoading}
								handleToastShowOpen={props.handleToastShowOpen}
								toggleRefresh={props.toggleRefresh}
								showBtn={props.showBtn}
							/>
						) : (
							<></>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Products;
