import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Ecommerce from "../abis/Ecommerce.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../components/Home/Home";
import MyProducts from "../components/MyProducts/MyProducts";
function App() {
	const [account, setAccount] = useState();
	const [productCount, setProductCount] = useState(0);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [ecommerce, setEcommerce] = useState();
	const [balance, setBalance] = useState();
	const [refresh, setRefresh] = useState(false);
	const toggleRefresh = () => setRefresh(!refresh);

	const loadBlockChainData = async () => {
		setProducts([]);
		if (window.ethereum) {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			setAccount(accounts[0]);
			const networkId = await window.ethereum.request({
				method: "net_version",
			});
			let balance = await window.ethereum.request({
				method: "eth_getBalance",
				params: [accounts[0], "latest"],
			});
			balance = ethers.utils.formatEther(balance);
			setBalance(balance);

			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const networkData = Ecommerce.networks[networkId];
			if (networkData) {
				await loadContract(signer, networkData);
			} else {
				window.alert("Ecommerce contract not deployed to detected network");
			}
		} else {
			window.alert(
				"Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
		}
	};

	const loadContract = async (signer, networkData) => {
		setLoading(true);
		const contract = new ethers.Contract(
			networkData.address,
			Ecommerce.abi,
			signer
		);
		let temp = await contract.functions.productCount();
		temp = temp.toString();
		setProductCount(temp);
		setEcommerce(contract);
		setLoading(false);
	};

	const loadProducts = async () => {
		console.log(productCount);
		for (var i = 1; i <= productCount; i++) {
			const product = await ecommerce?.functions.products(i);
			setProducts((products) => [...products, product]);
		}
	};

	useEffect(() => {
		loadBlockChainData();
	}, [refresh]);
	useEffect(() => {
		setProducts([]);
		loadProducts();
	}, [productCount]);

	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<Home
								account={account}
								productCount={productCount}
								products={products}
								loading={loading}
								ecommerce={ecommerce}
								balance={balance}
								refresh={refresh}
								setLoading={setLoading}
								toggleRefresh={toggleRefresh}
							/>
						}
					/>
					<Route
						exact
						path="/myproducts"
						element={
							<MyProducts
								account={account}
								productCount={productCount}
								products={products}
								loading={loading}
								ecommerce={ecommerce}
								balance={balance}
								refresh={refresh}
								setLoading={setLoading}
								toggleRefresh={toggleRefresh}
							/>
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
