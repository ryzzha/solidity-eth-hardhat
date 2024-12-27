// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Product {
        uint256 id;
        address seller;
        string title;
        uint256 price;
        uint8 quantity;
    }

    struct Order {
        uint256 id; 
        uint256 productId;
        address buyer;
        uint256 amountPaid;
        bool isDelivered;
        bool isWithdrawn;
    }

    uint256 public productCount = 0;
    uint256 public orderCount = 0;
    uint256 public contractBalance = 0; 
    uint256 public feePercent = 5; 

    address public owner;

    mapping(uint256 => Product) public products; 
    mapping(uint256 => Order) public orders; 

    event ProductAdded(uint256 indexed productId, address indexed seller, string title, uint256 price, uint8 quantity);
    event ProductPurchased(uint256 indexed orderId, uint256 indexed productId, address indexed buyer, uint256 amountPaid, uint256 fee);
    event OrderDelivered(uint256 indexed orderId, uint256 indexed productId, address indexed buyer);
    event FundsWithdrawn(address indexed seller, uint256 amount);
    event ContractBalanceWithdrawn(address indexed owner, uint256 amount);
    event Received(address sender, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    // Додавання товару
    function addProduct(string calldata title, uint256 price, uint8 quantity) external {
        require(msg.sender != address(0), "Invalid seller address");
        require(price > 0, "Price must be greater than zero");
        require(quantity > 0, "Quantity must be greater than zero");

        productCount++;
        products[productCount] = Product({
            id: productCount,
            seller: msg.sender,
            title: title,
            price: price,
            quantity: quantity
        });

        emit ProductAdded(productCount, msg.sender, title, price, quantity);
    }

    function buyProduct(uint256 productId, uint8 quantity) external payable {
        Product storage product = products[productId];
        require(product.id > 0, "Product does not exist");
        require(product.quantity >= quantity, "Not enough stock");
        require(msg.value >= product.price * quantity, "Incorrect payment");
        require(product.seller != address(0), "Invalid seller address");

        uint256 totalPayment = product.price * quantity;
        uint256 remains = msg.value - totalPayment;
        uint256 fee = (totalPayment * feePercent) / 100; 
        uint256 sellerAmount = totalPayment - fee; 

        if (remains > 0) {
            payable(msg.sender).transfer(remains);
        }

        // Зменшуємо кількість товару
        product.quantity -= quantity;

        orderCount++;
        orders[orderCount] = Order({
            id: orderCount,
            productId: productId,
            buyer: msg.sender,
            amountPaid: sellerAmount,
            isDelivered: false,
            isWithdrawn: false
        });

        contractBalance += fee;

        emit ProductPurchased(orderCount, productId, msg.sender, sellerAmount, fee);
    }

    function markOrderAsDelivered(uint256 orderId) external {
        Order storage order = orders[orderId];

        require(order.productId > 0, "Order does not exist");
        require(order.buyer == msg.sender, "Only the buyer can confirm delivery");
        require(!order.isDelivered, "Order is already delivered");

        order.isDelivered = true;

        emit OrderDelivered(orderId, order.productId, msg.sender);
    }

    function getProductQuantity(uint256 productId) external view returns (uint8) {
        Product storage product = products[productId];
        require(product.id > 0, "Product does not exist");
        return product.quantity;
    }

    function getAllProducts() external view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productCount);
        for (uint256 i = 1; i <= productCount; i++) { 
            allProducts[i - 1] = products[i];
        }
        return allProducts;
    }

   function getOrdersByBuyer(address buyer) external view returns (Order[] memory) {
    uint256 count = 0;
    for (uint256 i = 1; i <= orderCount; i++) {
        if (orders[i].buyer == buyer) {
            count++;
        }
    }

    Order[] memory result = new Order[](count);
    uint256 index = 0;

    for (uint256 i = 1; i <= orderCount; i++) {
        if (orders[i].buyer == buyer) {
            result[index] = orders[i];
            result[index].id = i; 
            index++;
        }
    }

    return result;
}

    function withdrawFunds() external {
        uint256 balance = 0;

        for (uint256 i = 1; i <= orderCount; i++) {
            Order storage order = orders[i];
            Product storage product = products[order.productId];

            if (product.seller == msg.sender && order.isDelivered && order.amountPaid > 0 && !order.isWithdrawn) {
                balance += order.amountPaid;
                order.amountPaid = 0;
            }
        }

        require(balance > 0, "No funds to withdraw");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(msg.sender, balance);
    }

    function withdrawContractBalance(uint256 amount) external onlyOwner {
        require(address(this).balance >= contractBalance, "Insufficient contract balance");
        require(amount > 0, "Amount must be greater than zero");
        require(amount <= contractBalance, "Not enough funds in the contract");

        contractBalance -= amount;

        (bool success, ) = owner.call{value: amount}(""); 
        require(success, "Withdrawal failed");

        emit ContractBalanceWithdrawn(owner, amount);
    }

    function setFeePercent(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent >= 1, "Fee percent must be >= 1");
        require(newFeePercent <= 50, "Fee percent must be <= 50");
        feePercent = newFeePercent;
    }

    receive() external payable {
        contractBalance += msg.value;
        emit Received(msg.sender, msg.value);
    }
}
