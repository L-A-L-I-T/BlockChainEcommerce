/* eslint-disable no-undef */
/* eslint-disable jest/valid-describe */
const { assert } = require("chai");

const Ecommerce = artifacts.require("./Ecommerce.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Ecommerce", ([deployer, seller, buyer]) => {
	let ecommerce;
	before(async () => {
		ecommerce = await Ecommerce.deployed();
	});

	describe("deployment", async () => {
		it("deploys successfully", async () => {
			const address = await ecommerce.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, "");
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
		});

		it("has a name", async () => {
			const name = await ecommerce.name();
			assert.equal(name, "Ecommerce App for Buying and Selling Goods");
		});
	});

	describe("products", async () => {
		let result, productCount;

		before(async () => {
			result = await ecommerce.createProduct(
				"iPhone X",
				web3.utils.toWei("1", "Ether"),
				"sdfsagergdgd",
				{ from: seller }
			);
			productCount = await ecommerce.productCount();
		});

		it("creates products", async () => {
			// SUCCESS
			assert.equal(productCount, 1);
			const event = result.logs[0].args;
			assert.equal(
				event.id.toNumber(),
				productCount.toNumber(),
				"id is correct"
			);
			assert.equal(event.name, "iPhone X", "name is correct");
			assert.equal(event.price, "1000000000000000000", "price is correct");
			assert.equal(event.owner, seller, "owner is correct");
			assert.equal(event.purchased, false, "purchased is correct");

			// FAILURE: Product must have a name
			await await ecommerce.createProduct(
				"",
				web3.utils.toWei("1", "Ether"),
				"sdfsagergdgd",
				{
					from: seller,
				}
			).should.be.rejected;
			// FAILURE: Product must have a price
			await await ecommerce.createProduct("iPhone X", 0, "sdfsagergdgd", {
				from: seller,
			}).should.be.rejected;
		});

		it("lists products", async () => {
			const product = await ecommerce.products(productCount);
			assert.equal(
				product.id.toNumber(),
				productCount.toNumber(),
				"id is correct"
			);
			assert.equal(product.name, "iPhone X", "name is correct");
			assert.equal(product.price, "1000000000000000000", "price is correct");
			assert.equal(product.owner, seller, "owner is correct");
			assert.equal(product.purchased, false, "purchased is correct");
		});

		it("sells products", async () => {
			// Track the seller balance before purchase
			let oldSellerBalance;
			oldSellerBalance = await web3.eth.getBalance(seller);
			oldSellerBalance = new web3.utils.BN(oldSellerBalance);

			// SUCCESS: Buyer makes purchase
			result = await ecommerce.purchaseProduct(productCount, {
				from: buyer,
				value: web3.utils.toWei("1", "Ether"),
			});

			// Check logs
			const event = result.logs[0].args;
			assert.equal(
				event.id.toNumber(),
				productCount.toNumber(),
				"id is correct"
			);
			assert.equal(event.name, "iPhone X", "name is correct");
			assert.equal(event.price, "1000000000000000000", "price is correct");
			assert.equal(event.owner, buyer, "owner is correct");
			assert.equal(event.purchased, true, "purchased is correct");

			// Check that seller received funds
			let newSellerBalance;
			newSellerBalance = await web3.eth.getBalance(seller);
			newSellerBalance = new web3.utils.BN(newSellerBalance);

			let price;
			price = web3.utils.toWei("1", "Ether");
			price = new web3.utils.BN(price);

			const exepectedBalance = oldSellerBalance.add(price);

			assert.equal(newSellerBalance.toString(), exepectedBalance.toString());

			// FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
			await ecommerce.purchaseProduct(99, {
				from: buyer,
				value: web3.utils.toWei("1", "Ether"),
			}).should.be.rejected; // FAILURE: Buyer tries to buy without enough ether
			// FAILURE: Buyer tries to buy without enough ether
			await ecommerce.purchaseProduct(productCount, {
				from: buyer,
				value: web3.utils.toWei("0.5", "Ether"),
			}).should.be.rejected;
			// FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
			await ecommerce.purchaseProduct(productCount, {
				from: deployer,
				value: web3.utils.toWei("1", "Ether"),
			}).should.be.rejected;
			// FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
			await ecommerce.purchaseProduct(productCount, {
				from: buyer,
				value: web3.utils.toWei("1", "Ether"),
			}).should.be.rejected;
		});
	});
});
