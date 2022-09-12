
import './App.css';

import { NavigationBar } from './components/navigation';
import { Gadgets } from './components/gadgets';
import { AddGadget } from './components/addgadget';


import { useState, useEffect, useCallback } from "react";


import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";


import tech from "./contracts/TechGadget.abi.json";  
import IERC from "./contracts/IERC20Token.abi.json";


const ERC20_DECIMALS = 18;  //for wei or gwei



const contractAddress = "0x76A5CD0c34e3af720eBCfbD067bfdd463bEDa1b1";  // contract address for the Ticket Verse
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // contract address for the cUSD Token




function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [gadgets, setGadgets] = useState([]);



/*************************** Prompt Celo Wallet To Allow User Connect **********************************************************/
  const connectToWallet = async () => {
    if (window.celo) {
      
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        
      }
    } else {
      
    }
  };

  
  
/*************************** Retrieving Balance Of User From Their Celo Wallet    **********************************************************/
  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(tech, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);



  /*************************** Renders The Gadget Array After Info Has Been Pushed Into It **********************************************************/
  const getGadgets = useCallback(async () => {
    const gadgetsLength = await contract.methods.getGadgetsLength().call();
    const gadgets = [];
    for (let index = 0; index < gadgetsLength; index++) {
      let _gadgets = new Promise(async (resolve, reject) => {
      let gadget = await contract.methods.getGadget(index).call();

        resolve({
          index: index,
          owner: gadget[0],
          image: gadget[1],
          description: gadget[2],
          price: gadget[3],
          noOfAvailable: gadget[4],
          sold: gadget[5]   
        });
      });
      gadgets.push(_gadgets);
    }

    const _gadgets = await Promise.all(gadgets);
    setGadgets(_gadgets);
  }, [contract]);

/*************************** Add Gadgets Template  **********************************************************/

  const addGadget = async (
    _image,
    _description,
    _price,
    _noOfAvailable
 
  ) => {
    let price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods
        .addGadget(_image, _description, price, _noOfAvailable)
        .send({ from: address });
      getGadgets();
    } catch (error) {
      alert(error);
    }
  };

  
  
/*************************** Modify Gadget Price **********************************************************/

  const modifyPrice = async (_index, _price) => { 
    const price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods.modifyPrice(_index, price).send({ from: address });
      getGadgets();
      alert("you have successfully changed the price");
     
    } catch (error) {
      alert(error);
    }};



    const addCatalogue = async (
      _index,
      _ammount
    ) => {
      try {
        await contract.methods
          .addCatalogue(_index, _ammount)
          .send({ from: address });
        getGadgets();
      } catch (error) {
        alert(error);
      }
    };

    const reduceCatalogue = async (
      _index,
      _ammount
   
    ) => {
      try {
        await contract.methods
          .reduceCatalogue(_index, _ammount)
          .send({ from: address });
        getGadgets();
      } catch (error) {
        alert(error);
      }
    };
  
/*************************** Buy Gadget **********************************************************/


  const buyGadget = async (_index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      const cost = gadgets[_index].price;
      await cUSDContract.methods
        .approve(contractAddress, cost)
        .send({ from: address });
      await contract.methods.buyGadget(_index).send({ from: address });
      getGadgets();
      getBalance();
      alert("you have successfully bought this image");
    } catch (error) {
      alert(error);
    }};


  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getGadgets();
    }
  }, [contract, getGadgets]);
  
  return (
    <div className="App">
      <NavigationBar cUSDBalance={cUSDBalance} />
      <h1>Our Gadgets Collections</h1>
      <Gadgets gadgets={gadgets}
       buyGadget={buyGadget}
       walletAddress={address}
       addCatalogue={addCatalogue}
       reduceCatalogue={reduceCatalogue} 
       modifyPrice={modifyPrice} />
    
      <AddGadget addGadget={addGadget} />
    </div>
  );
}

export default App;