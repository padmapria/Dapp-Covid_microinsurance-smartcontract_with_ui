// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Covid_Insurance {

    address public immutable owner;
    
    uint8 public constant LESS_SETTLEMENT = 2;
    uint8 public constant FULL_SETTLEMENT = 3;

    // minimum premium is 0.1 Eth
    uint256 public constant MIN_PREMIUM = 0.1 ether;

    // Max premium is 1 Eth
    uint256 public constant MAX_PREMIUM = 1 ether;

    uint256 private immutable INITIAL_BALANCE;

    // 38 degrees Celsius or more during 4 days in a row triggers settlement payment
    uint8 private constant MIN_TEMP = 38;

    // covid_positive triggers settlement payment
    bool private constant COVID_RESULT = true;  

    // address to amount insured
    mapping(address => uint256) public s_insuredAddrToAmt;

    //address to temperature 
    mapping(address => Temperature) private s_addrToTemp; 

    address[] private s_paid; 
    address[] private s_failed_to_pay; 

    struct Temperature {
        uint8 day1;
        uint8 day2;
        uint8 day3;
        uint8 day4;
        bool covid_result;
        uint256 amount_to_settle;
    }

    event SettlementPaid(uint256 _amount, address _to);

    constructor() payable {
        owner = msg.sender;
        INITIAL_BALANCE = msg.value;
        console.log("Insurance has balance %s by %s", msg.value, owner);    
    }

    modifier onlyNotOwner {
        require(msg.sender != owner, "Owner cannot perform this action");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function buyInsurance() public payable onlyNotOwner {
        uint256 amount = msg.value;
        address sender = msg.sender;

        require(s_insuredAddrToAmt[sender] == 0, "Already insured");
        require(amount >= MIN_PREMIUM, "Premium too low");
        require(amount <= MAX_PREMIUM, "Premium too high");

        s_insuredAddrToAmt[sender] = amount;
        console.log("%s bought insurance of: %s", sender, amount);
        console.log("Contract balance after new purchase is %s", address(this).balance);
    }

    function make_claim(uint8 day1, uint8 day2, uint8 day3, uint8 day4, bool covid_result) 
        public 
        payable 
        onlyNotOwner 
        returns (bool) 
    {
        console.log("Contract balance at claim is %s", address(this).balance);
        address sender = msg.sender;
        uint256 insured_amt = s_insuredAddrToAmt[sender];
        require(insured_amt > 0, "Not insured");

        Temperature memory temp = Temperature(day1, day2, day3, day4, covid_result, 0);

        // Check whether new temperature triggers settlement payment for this insurance
        if (shouldPaySettlement(temp)) {
            uint256 amount_to_settle = calculate_settlement(insured_amt);
            temp.amount_to_settle = amount_to_settle;

            s_addrToTemp[sender] = temp;
            paySettlement(sender, amount_to_settle);
            return true;
        } else {
            console.log("Sender is not a COVID patient", sender);
            return false;
        }
    }

    function shouldPaySettlement(Temperature memory temp) private pure returns (bool) {
        return (
            temp.day1 >= MIN_TEMP &&
            temp.day2 >= MIN_TEMP &&
            temp.day3 >= MIN_TEMP &&
            temp.day4 >= MIN_TEMP &&
            temp.covid_result == true
        );
    }

    function calculate_settlement(uint256 premium) private pure returns (uint256) {
        if (premium == MAX_PREMIUM) {
            return FULL_SETTLEMENT * premium;
        } else {
            return LESS_SETTLEMENT * premium;
        }
    }

    function paySettlement(address sender, uint256 amount_to_pay) private {
        console.log("To pay settlement to %s", sender);
        console.log("Contract balance before settlement is %s", address(this).balance);

        if (payable(sender).send(amount_to_pay)) {
            s_paid.push(sender);
            s_insuredAddrToAmt[sender] = 0;
            console.log("Sent %s wei to %s", amount_to_pay, sender);
            emit SettlementPaid(amount_to_pay, sender);
            console.log("Contract balance after settlement is %s", address(this).balance);
        } else {
            console.log("Failed to send %s wei to %s", amount_to_pay, sender);
            s_failed_to_pay.push(sender);
        }
    }

    function resend_failed_settlement() public onlyOwner {
        require(s_failed_to_pay.length > 0, "No unpaid claims");

        address[] memory failed_insurers = s_failed_to_pay;
        for (uint256 i = 0; i < failed_insurers.length; i++) {
            address insurer = failed_insurers[i];
            uint256 insured_amt = s_insuredAddrToAmt[insurer];
            require(insured_amt > 0, "Not insured");

            Temperature memory temp = s_addrToTemp[insurer];
            if (payable(insurer).send(temp.amount_to_settle)) {
                s_paid.push(insurer);
                s_failed_to_pay[i] = s_failed_to_pay[s_failed_to_pay.length - 1];
                s_failed_to_pay.pop();
                s_insuredAddrToAmt[insurer] = 0;
            }
        }
    }

    function transfer_excess_ToOwner() public onlyOwner {
        require(address(this).balance > INITIAL_BALANCE, "Contract balance low");
        uint256 sale_amount = address(this).balance - INITIAL_BALANCE;
        console.log(sale_amount);
        payable(owner).transfer(sale_amount);
    }

    function close_Insurance() public onlyOwner {
        require(address(this).balance > 0, "Contract balance low");
        payable(owner).transfer(address(this).balance);
    }

    function topup_contract() public payable onlyOwner {
        console.log("Contract balance after top-up is %s", address(this).balance);
    }
}
