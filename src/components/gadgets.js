import React from 'react';
import { useState } from "react";

export const Gadgets = (props) => {

  const [addammount, setaddAmmount] = useState('');
  const [reduceammount, setreduceAmmount] = useState('');
  const [newprice, setNewprice] = useState('');



  return <div className="card-container">
   
   {props.gadgets.map((gadget) => (
      <div class="card">
         <h3>Gadgets</h3>
        <img class="card-img-top" src={gadget.image} alt="Card image cap" />
        <div class="card-body">
          <h5 class="card-title">{gadget.sold} Gadgets Sold</h5>
          <h5 class="card-title">{gadget.noOfAvailable > 0 ? `${gadget.noOfAvailable} Gadgets Available` : `Sold out`}</h5>
          <p class="card-text">{gadget.description}</p>
          <p class="card-title">Price: {gadget.price / 1000000000000000000}cUSD</p>
          {props.walletAddress !== gadget.owner && gadget.noOfAvailable !== 0 && (
            <button type="button" onClick={() => props.buyGadget(gadget.index)} class="btn btn-dark mt-2">Buy Gadget</button>
          )
          }

          {props.walletAddress === gadget.owner && (
            <form>
              <div class="form-r">
                <input type="text" class="form-control mt-4" value={addammount}
                  onChange={(e) => setaddAmmount(e.target.value)} placeholder="enter amount to add to catalogue" />
                <button type="button" onClick={() => props.addCatalogue(gadget.index, addammount)} class="btn btn-dark mt-2">add catalogue</button>

              </div>
            </form>
          )}



          {props.walletAddress === gadget.owner && (
            <form>
              <div class="form-r">
                <input type="text" class="form-control mt-4" value={reduceammount}
                  onChange={(e) => setreduceAmmount(e.target.value)} placeholder="enter amount to remove from catalogue" />
                <button type="button" onClick={() => props.reduceCatalogue(gadget.index, reduceammount)} class="btn btn-dark mt-2">reduce catalogue</button>

              </div>
            </form>
          )}

          {props.walletAddress === gadget.owner && (
            <form>
              <div class="form-r">
                <input type="text" class="form-control mt-4" value={newprice}
                  onChange={(e) => setNewprice(e.target.value)} placeholder="new price" />
                <button type="button" onClick={() => props.modifyPrice(gadget.index, newprice)} class="btn btn-dark mt-2">Change Price</button>

              </div>
            </form>
          )}
        </div>
      </div>
    ))}

  </div>
};
