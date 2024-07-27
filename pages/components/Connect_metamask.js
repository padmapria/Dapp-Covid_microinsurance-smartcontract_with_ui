import Web3 from 'web3'
import {Insurance_contract} from './insurance_contract.js';

//way1 to import from parent
//export default function Eng_Auction({showAlert} ) {

//way2
export default function connect_metamask(props) {
 
    const connectToMetamask = async (e) => {
        /* To check if metamask is installed */
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
              /* request wallet connect */
              await window.ethereum.request({ method: "eth_requestAccounts" })
              /* create web3 instance and set to state var */
              const web3 = new Web3(window.ethereum)
              /* set web3 instance */
              props.setWeb3(web3);
              /* get list of accounts */
              const accounts = await web3.eth.getAccounts()
              /* set Account 1 to React state var */
              props.setAddressValue(accounts[0]);
              console.log("Accounts 0",+accounts[0])
              
              const cont = Insurance_contract(web3)
              props.setContract(cont);  
              
              var alertmsg = "connected to "+accounts[0]
              //way1
              //showAlert(alertmsg, "success");

              //way2
               props.showAlert(alertmsg, "success");
               e.preventDefault();
            } catch(err) {
               props.showAlert("Failed to connect", "danger");
            }
        } else {
            // meta mask is not installed use ganache
            console.log("install MetaMask use ganache instead")
        }
      }

  return (
    <>
    <div>
    </div>
    <div>
    <form className="form-inline">
      <button type="button" className="btn btn-warning" id="metamask connect" onClick={connectToMetamask}>Click to connect </button>
      </form>
    </div>
    </>
  )
}
