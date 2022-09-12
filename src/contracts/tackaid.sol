// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract TechGadget {


    uint internal gadgetsLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Gadget {
        address payable owner;
        string image;
        string description;
        uint price;
        uint noOfAvailable;
        uint sold;
    }

    mapping (uint => Gadget) internal gadgets;


// add a new gadget
    function addGadget(
        string memory _image,
        string memory _description, 
        uint _price,
        uint _noOfAvailable
    ) public {
        uint _sold = 0;
        gadgets[gadgetsLength] = Gadget(
            payable(msg.sender),
            _image,
            _description,
            _price,
            _noOfAvailable,
            _sold
        );
        gadgetsLength++;
    }

      // unlisting a gadget  from the marketplace
        function unlistGadget(uint _index) external {
	        require(msg.sender == gadgets[_index].owner, "can't delete picture");         
            gadgets[_index] = gadgets[gadgetsLength - 1];
            delete gadgets[gadgetsLength - 1];
            gadgetsLength--; 
	 }


// add more inventory
    function addCatalogue(uint _index, uint _ammount) external{
        require(msg.sender == gadgets[_index].owner, "only owner can perform transaction");
        require(_ammount != 0 , "only owner can perform transaction");
        gadgets[_index].noOfAvailable = gadgets[_index].noOfAvailable + _ammount;
    }

// reduce inventory
    function reduceCatalogue(uint _index, uint _ammount) external{
        require(msg.sender == gadgets[_index].owner, "only owner can perform transaction");
        require(_ammount < gadgets[_index].noOfAvailable, "only owner can perform transaction");
        gadgets[_index].noOfAvailable = gadgets[_index].noOfAvailable - _ammount;
    }

    // change gadget price
    function modifyPrice(uint _index, uint _newPrice) external{
        require(msg.sender == gadgets[_index].owner, "only owner can perform transaction");
        require(_newPrice != 0, "invalid price");
        gadgets[_index].price = _newPrice;
    }
    

// getting gadget
    function getGadget(uint _index) public view returns (
        address payable, 
        string memory, 
        string memory, 
        uint, 
        uint,
        uint
    ) {
        return (
            gadgets[_index].owner,
            gadgets[_index].image,
            gadgets[_index].description,
            gadgets[_index].price,
            gadgets[_index].noOfAvailable,
            gadgets[_index].sold
          
        );
    }


    //buying a gadget
    function buyGadget(uint _index) public payable  {
        require(gadgets[_index].noOfAvailable > 0, "Sold out");
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            gadgets[_index].owner,
            gadgets[_index].price
          ),
          "Transfer failed."
        );
        gadgets[_index].sold++;
        gadgets[_index].noOfAvailable--;
    }

    
    // to get the length of gadgets in the mapping
    function getGadgetsLength() public view returns (uint) {
        return (gadgetsLength);
    }
}