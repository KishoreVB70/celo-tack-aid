import React from 'react';
import { useState } from "react";

export const AddGadget = (props) => {

const [image, setImage] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [noOfAvailable, setNoOfAvailable] = useState('');


  return <div>
      <form>
  <div class="form-row">
     <h1> Add the gadget you want to sell</h1>
    
      <input type="text" class="form-control" value={image}
           onChange={(e) => setImage(e.target.value)} placeholder="image"/>
           
      <input type="text" class="form-control mt-2" value={description}
           onChange={(e) => setDescription(e.target.value)} placeholder="description"/>

      <input type="text" class="form-control mt-2" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="price"/>

<input type="text" class="form-control mt-2" value={noOfAvailable}
           onChange={(e) => setNoOfAvailable(e.target.value)} placeholder="No of Available Gadget"/>


      <button type="button" onClick={()=>props.addGadget(image, description, price, noOfAvailable)} class="btn btn-dark mt-2">Add Gadget</button>
  </div>
</form>
  </div>;
};
