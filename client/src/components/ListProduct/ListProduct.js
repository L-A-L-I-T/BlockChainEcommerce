import React, { useState } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { Modal, Form, Alert } from "react-bootstrap";

const client = create("https://ipfs.infura.io:5001/api/v0");

function ListProduct(props) {
	const [name, setName] = useState();
	const [price, setPrice] = useState();
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState();
	const [show, setShow] = useState(false);
	const handleNameChange = (e) => {
		setName(e.target.value);
	};
	const handlePriceChange = (e) => {
		setPrice(e.target.value);
	};

	const handleAddProduct = async () => {
		if (!name || !price) {
			setShow(true);
		} else {
			setLoading(true);
			await props.ecommerce?.functions.createProduct(
				name,
				ethers.utils.parseEther(price),
				file.path
			);
			setName("");
			setPrice("");
			setFile(null);
			console.log(props.productCount);
			setLoading(false);
			props.handleClose();
			props.handleToastShowOpen();
		}
	};

	const handleFileChange = async (e) => {
		// console.log(e.target.files);
		// const file = e.target.files[0];
		const file = e.target.files[0];
		const result = await client.add(file);
		setFile(result);
		// console.log(files);
		// for (var file in files) {
		// 	const result = await client.add(files[file]);
		// 	console.log(result);
		// 	setFiles((prev) => [...prev, result.path]);
		// }
	};

	const resetInputs = () => {
		setName("");
		setPrice("");
		setLoading(false);
		setFile(null);
	};

	return (
		<>
			<Modal
				{...props}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				show={props.show}
				onHide={props.handleClose}
			>
				{show && (
					<Alert variant="danger" onClose={() => setShow(false)} dismissible>
						Please Enter Product Name and Price!
					</Alert>
				)}
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Modal heading
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Product Name</Form.Label>
							<Form.Control
								type="text"
								autoFocus
								value={name}
								onChange={handleNameChange}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Product Price(in ETH)</Form.Label>
							<Form.Control
								type="number"
								value={price}
								onChange={handlePriceChange}
							/>
						</Form.Group>
						{client ? (
							<Form.Group
								className="mb-3"
								controlId="exampleForm.ControlInput1"
							>
								<Form.Label>Product Image</Form.Label>
								<Form.Control type="file" onChange={handleFileChange} />
							</Form.Group>
						) : (
							<p>
								Oh oh, Not connected to IPFS. Checkout out the logs for errors
							</p>
						)}
						{file && (
							<div>
								<img
									width="200"
									height="200"
									src={`https://ipfs.infura.io/ipfs/${file.path}`}
									alt="images"
								/>
							</div>
						)}
					</Form>
					<Modal.Footer>
						<button
							type="button"
							class="btn btn-secondary"
							data-bs-dismiss="modal"
							onClick={() => {
								resetInputs();
								props.handleClose();
							}}
						>
							Close
						</button>
						<button
							type="button"
							class="btn btn-primary"
							onClick={handleAddProduct}
						>
							{loading ? "Loading...." : "Add Product"}
						</button>
					</Modal.Footer>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default ListProduct;
