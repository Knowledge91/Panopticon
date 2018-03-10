pragma solidity ^0.4.16;

contract Panopticon {
  address public client;
  address public fabric;
  uint256 public balance;

  bool public hasChildLabour = false;

 l uint public deadline;
  bool public fulfilled;

  event ContractEnd(bool fulfilled, uint256 amount);

  /**
   * Constructor
   *
   */
  function Panopticon(address _client, address _fabric, uint256 durationInSeconds, bool _hasChildLabour) payable public {
    client = _client;
    fabric = _fabric;
    balance = msg.value;
    deadline = now + durationInSeconds * 1 seconds;
    hasChildLabour = _hasChildLabour;
  }

  modifier afterDeadline() { if (now >= deadline) _; }

  /**
   * after contract end send balance to fabric (or back to client)
   *
   */
  function fulfillContract() afterDeadline public returns (bool) {
    if(!hasChildLabour) {
      fabric.transfer(balance);
      ContractEnd(true, balance);
      fulfilled = true;
      return true;
    } else {
      client.transfer(balance);
      ContractEnd(false, balance);
      fulfilled = false;
      return false;
    }
  }
}
