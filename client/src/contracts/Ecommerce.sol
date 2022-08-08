pragma solidity ^0.8.0;

contract Ecommerce {
    string public name;
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        string image;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        string image,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        string image,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Ecommerce App for Buying and Selling Goods";
    }

    function createProduct(
        string memory _name,
        uint256 _price,
        string memory _image
    ) public {
        //! Require a valid name
        require(bytes(_name).length > 0);
        //! Require a valid price
        require(_price > 0);
        //todo : Increment product count
        productCount++;
        //todo : Create the product
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            _image,
            payable(msg.sender),
            false
        );
        //todo : trigger an event
        emit ProductCreated(
            productCount,
            _name,
            _price,
            _image,
            payable(msg.sender),
            false
        );
    }

    function purchaseProduct(uint256 _id) public payable {
        //todo : fetch the product
        Product memory _product = products[_id];
        //todo : fetch the owner
        address payable _seller = _product.owner;
        //todo : make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount);
        //todo : make sure that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        //todo : make sure that product is not been purchased
        require(!_product.purchased);
        //todo : make sure that buyer is not seller
        require(_seller != msg.sender);
        //todo : transfer ownership to the buyer
        _product.owner = payable(msg.sender);
        //todo : mark as purchased
        _product.purchased = true;
        //todo : update the product
        products[_id] = _product;
        //todo : pay the seller by sending ether
        payable(address(_seller)).transfer(msg.value);
        //todo : trigger an event
        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            _product.image,
            payable(msg.sender),
            true
        );
    }
}
