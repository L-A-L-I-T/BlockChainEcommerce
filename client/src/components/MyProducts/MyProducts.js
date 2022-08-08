import React from "react";
import ProductCard from "../Products/ProductCard";
import styles from "../Products/Products.module.css";
import Navbar from "../Navbar/Navbar";
function MyProducts(props) {
	const myListedProducts = props.products.filter((product) => {
		return product.owner.toLowerCase() === props.account && !product.purchased;
	});
	const myPurchasedProducts = props.products.filter((product) => {
		return product.owner.toLowerCase() === props.account && product.purchased;
	});
	return (
		<div>
			<Navbar
				loading={props.loading}
				account={props.account}
				ecommerce={props.ecommerce}
				setLoading={props.setLoading}
				productCount={props.productCount}
				toggleRefresh={props.toggleRefresh}
			/>
			<div>Products({myListedProducts.length})</div>
			<div className={`container-fluid ${styles.innerContainer}`}>
				<div className={`row justify-content-start`}>
					{myListedProducts.length > 0 ? (
						myListedProducts.map((product, index) => {
							return !product.purchased ? (
								<ProductCard
									product={product}
									key={index}
									account={props.account}
									ecommerce={props.ecommerce}
									setLoading={props.setLoading}
									handleToastShowOpen={props.handleToastShowOpen}
									toggleRefresh={props.toggleRefresh}
									showBtn={false}
								/>
							) : (
								<></>
							);
						})
					) : (
						<div>You dont have any listed Products</div>
					)}
				</div>
			</div>
			<div>Puchased Products({myPurchasedProducts.length})</div>
			<div className={`container-fluid ${styles.innerContainer}`}>
				<div className={`row justify-content-start`}>
					{myPurchasedProducts.length > 0 ? (
						myPurchasedProducts.map((product, index) => {
							return product.purchased ? (
								<ProductCard
									product={product}
									key={index}
									account={props.account}
									ecommerce={props.ecommerce}
									setLoading={props.setLoading}
									handleToastShowOpen={props.handleToastShowOpen}
									toggleRefresh={props.toggleRefresh}
									showBtn={false}
								/>
							) : (
								<></>
							);
						})
					) : (
						<div>You dont have any Purchased Products</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default MyProducts;
