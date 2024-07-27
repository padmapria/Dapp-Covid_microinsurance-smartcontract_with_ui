import { useState, useEffect } from 'react'
import Connect_metamask from './components/Connect_metamask';
import Alert_msg from './components/Alert_msg';
import Check_purchased_insurance from './components/check_purchased_insurance'

export default function claim() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [day1, setDay1] = useState(null)
    const [day2, setDay2] = useState(null)
    const [day3, setDay3] = useState(null)
    const [day4, setDay4] = useState(null)
    const [covid_positive, setCovid_positive] = useState(false); 
   
      //called only once
  useEffect(() => {
   // claimListener();
  }, []);

    // https://stackoverflow.com/questions/72016466/nextjs-pass-image-as-props-to-be-used-with-next-image
    const [alertmsg, setAlertmsg] = useState(null);
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

    function check_box_Value(e) {
      var value = e.target.value;
      console.log(value);
      setCovid_positive(value);
    }

    async function claimListener() {
      contract.on("SettlementPaid", (amount, to) => {
        const value = ethers.utils.formatEther(amount);
        const message = "💰 Settlement paid: " + value + " ETH to " + to;
  
        console.log("Settlement paid: %s ETH to ", value, to);
      });
    }


    const submit_claim  = async (e) => {
      //https://stackoverflow.com/questions/50193227/basic-react-form-submit-refreshes-entire-page
      e.preventDefault();
      if(contract){
          try {
            //https://www.youtube.com/watch?v=rXZSnUOhnwc
            await contract.methods.make_claim(day1,
            day2, day3 , day4, covid_positive ).send({
              from: address, 
              gas: 3000000,
              gasPrice: null
            });
            var msg = "Successfully added claim ******* ";
            showAlert(msg , "success");
            setDay2('')
            setDay3('')
            setDay4('')
            setDay1('') 
            setCovid_positive(false)           
          } catch(err) {
            console.log(err)
            showAlert("you are not insured", "danger");
          }
      } 
      else{
        showAlert("Connect to metamask", "danger");
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
      <div>
       <Check_purchased_insurance  showAlert={showAlert} contract={contract} web3={web3} address={address}/>
        <h3>
          Make claim (can claim for self, if insured amount is more than 0)
        </h3>
      <br />  
      <form className="form-inline">
      <div className="d-inline-flex align-items-center  w-50 mt-3">
          <label htmlFor="day1" className='col-sm-3 col-form-label'>Day1 Temperature </label>
          <input className="form-control"  type="text"  id="day1" value={day1}  placeholder="Day1 Temperature" pattern="[0-9.]+"  min="34" max="43"
          onChange={(e) => setDay1(e.target.value)}/>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center w-50 mt-3">
      <label htmlFor="day2" className='col-sm-3 col-form-label'>Day2 Temperature </label>
          <input className="form-control"  type="text"  id="day2" value={day2}  placeholder="Day2 Temperature" pattern="[0-9.]+"  min="34" max="43"
          onChange={(e) => setDay2(e.target.value)}/>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center w-50 mt-3">
      <label htmlFor="day3" className='col-sm-3 col-form-label'>Day3 Temperature </label>
          <input className="form-control"  type="text"  id="day3" value={day3}  placeholder="Day3 Temperature" pattern="[0-9.]+"  min="34" max="43"
          onChange={(e) => setDay3(e.target.value)}/>
      </div>
      <br/>
      
      <div className="d-inline-flex align-items-center w-50 mt-3">
      <label htmlFor="day4" className='col-sm-3 col-form-label'>Day4 Temperature </label>
          <input className="form-control"  type="text"  id="day4" value={day4}  placeholder="Day4 Temperature" pattern="[0-9.]+"  min="34" max="43"
          onChange={(e) => setDay4(e.target.value)}/>
      </div>
      <br/>
      <br/>
      <div className="form-check">
          <label className="form-check-label" for="flexCheckChecked">
           I'm tested Covid positive
          </label>
          <input className="form-check-input" type="checkbox"  id="flexCheckChecked" value="true" onChange={check_box_Value} />
      </div>
      
      <br/>
      <button type="submit"  onClick={submit_claim}  className="btn btn-primary mx-3">Claim</button>
      </form>
      <br/>
      </div>
    </div>
    </>
  )
}
