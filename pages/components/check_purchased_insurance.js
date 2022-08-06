import React from 'react'
import { useState, useEffect } from 'react'
export default function Check_purchased_insurance(props) {
      const [insured_amt, setInsured_amt] = useState(null)

      const check_insured = async () => {
        alert("Check_insured")
        if(props.contract){
          let result = await props.contract.methods.s_insuredAddrToAmt(props.address).call();
          setInsured_amt(props.web3.utils.fromWei(result, 'ether'));
        }
        else{
          showAlert("Connect to metamask", "danger");
        }
      }
  return (
    <div>
       <h4 className="mt-2">
                Check Insured Amount     
        </h4>
        <div className="d-inline-flex align-items-center w-50 mt-3">
          <button type="submit"  onClick={check_insured}  className="btn btn-primary mx-3">Check Insured Amount</button>
        </div>
        <br/>
            <div className="d-inline-flex align-items-center w-50 mt-3">
              <label htmlFor="insured_amt" className='col-sm-3 col-form-label bold' >Insured Amount in Eth: </label>
                <output>{insured_amt} </output>
          </div>
            <br />
    </div>
  )
}
