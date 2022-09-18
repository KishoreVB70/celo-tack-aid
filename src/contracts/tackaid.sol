// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract TechGadget {
    uint private gadgetsLength = 0;
    address private cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Gadget {
        address payable owner;
        string image;
        string description;
        uint price;
        uint noOfAvailable;
        uint sold;
    }

    mapping(uint => Gadget) private gadgets;

    modifier checkIfGadgetOwner(uint _index) {
        require(msg.sender == gadgets[_index].owner, "Unauthorized caller");
        _;
    }

    modifier checkIfValidInput(uint _input) {
        require(_input > 0, "invalid input");
        _;
    }

    /**
     * @dev allow users to add a gadget to sell
     * @notice  values entered needs to be valid
     * @param _noOfAvailable the number of gadgets available for sale
     */
    function addGadget(
        string calldata _image,
        string calldata _description,
        uint _price,
        uint _noOfAvailable
    ) public checkIfValidInput(_price) checkIfValidInput(_noOfAvailable) {
        require(bytes(_image).length > 0, "Empty image");
        require(bytes(_description).length > 0, "Empty description");
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

    /**
     * @dev allow gadgets' owners to unlist their gadgets. Cleanup of gagdet's data occurs
     * @notice This will remove the gadget from the platform
     */
    function unlistGadget(uint _index) public checkIfGadgetOwner(_index) {
        uint newGadgetsLength = gadgetsLength - 1;
        gadgets[_index] = gadgets[newGadgetsLength];
        delete gadgets[newGadgetsLength];
        gadgetsLength = newGadgetsLength;
    }

    /**
     * @dev allow gadgets' owners to increase their inventory of a gadget(noOfAvailable)
     * @param _amount the number to add with the current inventory
     *
     */
    function addInventory(uint _index, uint _amount)
        public
        checkIfGadgetOwner(_index)
        checkIfValidInput(_amount)
    {
        Gadget storage currentGadget = gadgets[_index];
        uint newNoOfAvailable = currentGadget.noOfAvailable + _amount;
        currentGadget.noOfAvailable = newNoOfAvailable;
    }

        /**
     * @dev allow gadgets' owners to reduce their inventory of a gadget(noOfAvailable)
     * @notice Amount to deduct from the current inventory needs to be less or equal to the current inventory
     * @param _amount the number to deduct from the current inventory
     */
    function reduceInventory(uint _index, uint _amount)
        external
        checkIfGadgetOwner(_index)
    {
        Gadget storage currentGadget = gadgets[_index];
        require(
            _amount <= currentGadget.noOfAvailable,
            "amount can only be less or equal to the number of gadgets available"
        );
        uint newNoOfAvailable = currentGadget.noOfAvailable - _amount;
        currentGadget.noOfAvailable = newNoOfAvailable;
    }

    /**
     * @dev allow gadgets' owners to change the price of their gadgets
     * @notice newPrice needs to be greater than zero
     */
    function modifyPrice(uint _index, uint _newPrice)
        external
        checkIfGadgetOwner(_index)
        checkIfValidInput(_newPrice)
    {
        gadgets[_index].price = _newPrice;
    }

    // getting gadget
    function getGadget(uint _index)
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            uint,
            uint,
            uint
        )
    {
        return (
            gadgets[_index].owner,
            gadgets[_index].image,
            gadgets[_index].description,
            gadgets[_index].price,
            gadgets[_index].noOfAvailable,
            gadgets[_index].sold
        );
    }

    /**
     * @dev allow users to buy a gadget from the platform
     * @notice Reverts if gadget is out of inventory(out of stock)
     */
    function buyGadget(uint _index, uint _quantity) public payable checkIfValidInput(_quantity){
        Gadget storage currentGadget = gadgets[_index];
        require(currentGadget.noOfAvailable > _quantity, "Stocks unavailable");
        require(
            currentGadget.owner != msg.sender,
            "You can't buy your own gadgets"
        );
        currentGadget.sold+= _quantity;
        currentGadget.noOfAvailable-= _quantity;
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                currentGadget.owner,
                currentGadget.price * _quantity
            ),
            "Transfer failed."
        );
    }

    // to get the length of gadgets in the mapping
    function getGadgetsLength() public view returns (uint) {
        return (gadgetsLength);
    }
}
