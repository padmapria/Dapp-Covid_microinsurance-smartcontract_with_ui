import { useState, useEffect } from 'react'
import Connect_metamask from './components/Connect_metamask';
import Alert_msg from './components/Alert_msg';

import * as contract_end_point from '../contract_deployed_endpoint';
export default function admin() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [owner, setOwner] = useState(null)
    const [alertmsg, setAlertmsg] = useState(null);
    const [topup, setTopup] = useState(null);

    useEffect(() => {
      }, [contract])

    const showAlert = (message, type)=>{
      setAlertmsg({
        msg: message,
        type: type
      })
      setTimeout(() => {
        setAlertmsg(null);
      }, 5000);
    }

    const setAddressVal = (value)=>{
      setAddress(value);
    }

    const setContractVal = (value)=>{
      setContract(value);
    }

    const setWeb3Val = (value)=>{
      setWeb3(value);
    }
    

    const pay_unpaid  = async (e) => {
        //https://stackoverflow.com/questions/50193227/basic-react-form-submit-refreshes-entire-page
        e.preventDefault();
        if(contract &&  address == contract_end_point.covid_Insurance_owner_Addr){
            try {
              //https://www.youtube.com/watch?v=rXZSnUOhnwc
               await contract.methods.resend_failed_settelemtnt().send({
                from: address, 
                gas: 3000000,
                gasPrice: null
              });
              
              var msg = "Unpaid claims eth transfer successful ******* ";
              showAlert(msg , "success");  
            } catch(err) {
              console.log(err)
             showAlert("No unpaid claims", "warning");
            }
        } 
        else{
          showAlert("Connect to metamask from owner account", "danger");
        }
        }

        const transfer_to_owner  = async (e) => {
          //https://stackoverflow.com/questions/50193227/basic-react-form-submit-refreshes-entire-page
          e.preventDefault();
          if(contract &&  address == contract_end_point.covid_Insurance_owner_Addr){
              try {
                //https://www.youtube.com/watch?v=rXZSnUOhnwc
                 await contract.methods.transfer_excess_ToOwner().send({
                  from: address, 
                  gas: 3000000,
                  gasPrice: null
                });
                
                var msg = "Transfer excess to owner successful ******* ";
                showAlert(msg , "success");  
              } catch(err) {
                console.log(err)
               showAlert("Contract Balance low", "warning");
              }
          } 
          else{
            showAlert("Connect to metamask from owner account", "danger");
          }
          }

        const top_up_contract  = async (e) => {
          e.preventDefault();
          if(contract && address == contract_end_point.covid_Insurance_owner_Addr){
            try {
              //https://www.youtube.com/watch?v=rXZSnUOhnwc
              await contract.methods.topup_contract().send({
                from: address, 
                value: web3.utils.toWei(topup, 'ether'),
                gas: 3000000,
                gasPrice: null
              });
        
              var msg = "Top up successful with ******* "+topup +"ether";
              showAlert(msg , "success");
              setTopup('')
            } catch(err) {
              console.log(err)
              showAlert("Balance low", "warning");
            }
          }
           else{
            showAlert("Connect to metamask from owner account", "danger");
          }
        }

        const close_insurance  = async (e) => {
          e.preventDefault();
          if(contract && address == contract_end_point.covid_Insurance_owner_Addr){
            try {
              //https://www.youtube.com/watch?v=rXZSnUOhnwc
              await contract.methods.close_Insurance().send({
                from: address, 
                gas: 3000000,
                gasPrice: null
              });
        
              var msg = "Insurance closed successfully";
              showAlert(msg , "success");
              
            } catch(err) {
              console.log(err)
              showAlert("Insurance closing error", "danger");
            }
          }
           else{
            showAlert("Connect to metamask from owner account", "danger");
          }
        }

  return (
    <>
      <div className="container">
      <Alert_msg alertmsg={alertmsg}/>
      <br/>
      <div className="d-inline-flex align-items-center  w-50">
          <label htmlFor="metamask connect" className='col-sm-3 col-form-label'>Connect to metamask</label>
          <Connect_metamask showAlert={showAlert}   setWeb3 = {setWeb3Val} 
         setAddressValue={setAddressVal}  setContract = {setContractVal}  />
        </div>
      <br/>
        <h3 className="mt-5">
            For Admin use (Only owner)
        </h3>
  
      <div className="mt-5"> 
        <div className="d-inline-flex align-items-center  w-50">
        <label htmlFor="metamask connect" className='col-sm-3 col-form-label'>To Pay unpaid claims</label>
        <button type="submit"  onClick={pay_unpaid}  className="btn btn-primary mx-3">pay unpaid claims</button>
        </div>
    </div>
    <br />
    <div>
        <h3>
            To topup contract 
        </h3>
    <form className="form-inline">
      <div className="d-inline-flex align-items-center w-25 mt-3">
          <label htmlFor="new_bid" className='col-sm-3 col-form-label mx-3' >Premium </label>
          <input className="form-control"  type="number"  id="new_bid" 
           value={topup} onChange={(e) => setTopup(e.target.value)} placeholder="Amount in Eth" 
           pattern="[0-9.]+"  min="1" max="50" required/>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center  w-50 mt-3">
        <button type="submit"  onClick={top_up_contract}  className="btn btn-primary mx-3">Topup Contract balance</button>
      </div>
      </form>
    </div>
    <br/>
   
    <div className="mt-2"> 
       <h3>
            Transfer collected insurance amount to owner
        </h3>
        <div className="d-inline-flex align-items-center  w-50">
        <button type="submit"  onClick={transfer_to_owner}  className="btn btn-primary mx-3">Transfer excess amount</button>
        </div>

        <h3 className="mt-5">
            Close Insurance contract 
        </h3>
        <div className="d-inline-flex align-items-center  w-50">
        <button type="submit"  onClick={close_insurance}  className="btn btn-primary mx-3">Close Insurance</button>
        </div>
    </div>
    </div>
    </>
  )
}
