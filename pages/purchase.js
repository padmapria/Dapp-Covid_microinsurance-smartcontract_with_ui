import { useState, useEffect } from 'react'
import Connect_metamask from './components/Connect_metamask';
import Alert_msg from './components/Alert_msg';
import Check_min_premium from './components/check_min_premium';
import Check_purchased_insurance from './components/check_purchased_insurance'

export default function purchase() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [amount, setAmount] = useState(null)
    const [min_premium, setMin_premium] = useState(null)
    const [max_premium, setMax_premium] = useState(null)
    const [min_benefit, setMin_benefit] = useState(null)
    const [max_benefit, setMax_benefit] = useState(null)

    useEffect(() => {
      updateState()
    }, [contract])
  
    const updateState = () => {
     // if (contract) getBuyers()
     // if (contract) fetch_auction_item()
    }

    // https://stackoverflow.com/questions/72016466/nextjs-pass-image-as-props-to-be-used-with-next-image
    const [alertmsg, setAlertmsg] = useState(null);
    const showAlert = (message, type)=>{
      setAlertmsg({
        msg: message,
        type: type
      })
      setTimeout(() => {
        setAlertmsg(null);
      }, 2000);
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

    const get_min_max_value = async () => {
      if(contract){
        try {
          const result = await contract.methods.MIN_PREMIUM().call();
          setMin_premium(web3.utils.fromWei(result, 'ether'));

           result = await contract.methods.MAX_PREMIUM().call();
          setMax_premium(web3.utils.fromWei(result, 'ether'));

          result = await contract.methods.LESS_SETTLEMENT().call();
          setMin_benefit(result)

          result = await contract.methods.FULL_SETTLEMENT().call();
          setMax_benefit(result)

        } catch(err) {
          console.log(err)
        }
      }else{
        showAlert("Connect to metamask", "danger");
      }
    }

      const buyInsurance  = async (e) => {
        e.preventDefault();
        if(contract){
          try {
            //https://www.youtube.com/watch?v=rXZSnUOhnwc
            await contract.methods.buyInsurance().send({
              from: address, 
              value: web3.utils.toWei(amount, 'ether'),
              gas: 3000000,
              gasPrice: null
            });
      
            var msg = "purchased covid insurance ******* "+amount +"ether";
            showAlert(msg , "success");
            setAmount('')

          } catch(err) {
            console.log(err)
            showAlert("covid insurance purchase error", "danger");
          }
        }
         else{
          showAlert("Connect to metamask", "danger");
        }
      }
     
  return (
    <> 
    {/* To remove wrap in label columns */}
    <div className="container" style={{ 
              whiteSpace: "nowrap" }}>
      <Alert_msg alertmsg={alertmsg}/>
      <br/>
      <div className="row " style={{ 
              fontSize: "20px" }} > 
      <div className="col-6">
      <div className="d-inline-flex align-items-center  w-50">
          <label htmlFor="metamask connect" className='col-sm-7 col-form-label mx-3'>Connect to metamask</label>
         <Connect_metamask showAlert={showAlert}   setWeb3 = {setWeb3Val} 
         setAddressValue={setAddressVal}  setContract = {setContractVal} />
      </div>
      <br/>
      <br/>
        
      <Check_min_premium get_min_max_value={get_min_max_value} min_premium={min_premium} max_premium={max_premium} 
      min_benefit={min_benefit} max_benefit={max_benefit}/>
      
      <h3 className="mt-4">
          Purchase Insurance (Owner not allowed)
        </h3>
      <br />
      <form className="form-inline">
      <div className="d-inline-flex align-items-center w-50 mt-3">
          <label htmlFor="new_bid" className='col-sm-3 col-form-label mx-3' >Premium </label>
          <input className="form-control"  type="number"  id="new_bid" 
           value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in Eth" 
           pattern="[0-9.]+"  min="1" max="10" required/>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center  w-50 mt-3">
        <button type="submit"  onClick={buyInsurance}  className="btn btn-primary mx-3">Buy Insurance</button>
        
      </div>
      </form>
        <br/>
      </div>
       
    </div>
    </div>
    </>
  )
}
