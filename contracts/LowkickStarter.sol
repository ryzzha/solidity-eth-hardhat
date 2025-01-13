// //SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LowkickStarter {
    address owner;
    struct LowkickCompaign {
        Compaign targetContract;
        bool claimed;
    }
    mapping(uint => LowkickCompaign) public compaings;
    uint currentCompaign = 0;
    uint MAX_DURATION = 30 days;
 
    constructor() {
        owner = msg.sender;
    }

    event CompaignStarted(uint id, address orginazer, uint goal, uint endsAt);

    function start(uint _goal, uint _endsAt) external {
        require(_goal > 0, "goal must be greeter than zero");
        require(_endsAt > block.timestamp && _endsAt < block.timestamp + MAX_DURATION, "ends at in diaposon now and 30 days");

        currentCompaign = currentCompaign + 1;

        Compaign newCompaign = new Compaign(msg.sender, currentCompaign, _goal, _endsAt);

        compaings[currentCompaign] = LowkickCompaign({
            targetContract: newCompaign,
            claimed: false
        });

        emit CompaignStarted(currentCompaign, msg.sender, _goal, _endsAt);
    }

    function onClaimed(uint _id) external {
        LowkickCompaign storage targetCompaign = compaings[_id];

        require(msg.sender == address(targetCompaign.targetContract), "different address send true id");

        targetCompaign.claimed = true;
    }
}

contract Compaign {
    address organizer;
    uint id;
    uint goal;
    uint endsAt;
    LowkickStarter parent;
    uint pledged;
    mapping(address => uint) pledgeds;
    bool claimed;

    constructor(address _organizer, uint _id, uint _goal, uint _endsAt) {
        organizer = _organizer;
        id = _id;
        goal = _goal;
        endsAt = _endsAt;
        parent = LowkickStarter(msg.sender);
    }

    event Pledged(address sender, uint amount, uint time);

    modifier notEnds() {
        require(block.timestamp < endsAt, "already end");
        _;
    }

    modifier Ends() {
        require(block.timestamp > endsAt, "to early");
        _;
    }

    function pledge() external payable notEnds {
        require(msg.value > 0, "value must be grreter than zero");

        pledged += msg.value;
        pledgeds[msg.sender] = msg.value;

        emit Pledged(msg.sender, msg.value, block.timestamp);
    }

    function refundPledge(uint _amount) external notEnds {
        require(_amount <= pledgeds[msg.sender], "canot withdraw more than you pledge");

        pledged -= _amount;
        pledgeds[msg.sender] -= _amount;

        payable(msg.sender).transfer(_amount);
    }

    function claim() external Ends {
        require(!claimed, "already claimed");
        require(msg.sender == organizer, "not orginazer");
        require(pledged >= goal, "not enougth");

        payable(msg.sender).transfer(pledged);
        claimed = true;

        parent.onClaimed(id);
    }

    function fullRefund() external Ends {
        require(pledgeds[msg.sender] >= 0, "you not pledged");

        uint refundValue = pledgeds[msg.sender];
        pledged -= refundValue;
        pledgeds[msg.sender] = 0;

        payable(msg.sender).transfer(refundValue);
    }
}