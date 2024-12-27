// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract AuctionEngine {
    address public owner;
    uint constant DURATION  = 2 days;
    uint FEE = 10;

    struct Auction {
        address payable seller;
        string item;
        uint startingPrice;
        uint finalPrice;
        uint startAt;
        uint endAt;
        uint discountRate;
        bool stopped;
    }

    Auction[] public auctions;

    event AuctionCreated(uint index, string itemName, uint startingPrice, uint duration);
    event AuctionEnded(uint index, uint currentPrice, address winner);

    constructor() {
        owner = msg.sender;
    }

    function createAuction(string calldata _item, uint _startingPrice, uint _duration, uint _discountRate) public {
        _duration = _duration == 0 ? DURATION : _duration;

        require(_startingPrice >= _discountRate * _duration, "dont enought price for duration");

        Auction memory newAuction = Auction({
            seller: payable(msg.sender),
            item: _item,
            startingPrice: _startingPrice,
            finalPrice: _startingPrice,
            startAt: block.timestamp,
            endAt: block.timestamp + _duration,
            discountRate: _discountRate,
            stopped: false
        });

        auctions.push(newAuction);

        emit AuctionCreated(auctions.length - 1, _item, _startingPrice, _duration);
    }

    function getPriceFor(uint index) public view returns(uint) {
        Auction memory selectedAuction = auctions[index];
        require(!selectedAuction.stopped, "auction is stopped!");
        uint elapsed = block.timestamp - selectedAuction.startAt;
        uint discount = elapsed * selectedAuction.discountRate;
        return selectedAuction.startingPrice - discount;
    }

    function buy(uint index) external payable {
        Auction storage selectedAuction = auctions[index];
        require(!selectedAuction.stopped, "auction is stopped!");
        require(block.timestamp < selectedAuction.endAt, "auction is clossed!");
        uint currentPrice = getPriceFor(index);
        require(msg.value >= currentPrice, "dont enough funds!");
        selectedAuction.stopped = true;
        selectedAuction.finalPrice = currentPrice;
        uint refund = msg.value - currentPrice;
        if(refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        selectedAuction.seller.transfer(
            currentPrice - ((currentPrice * FEE) / 100)
        );
        emit AuctionEnded(index, currentPrice, msg.sender);
    }
}