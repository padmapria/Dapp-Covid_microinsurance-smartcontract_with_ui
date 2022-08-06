import Covid_Insurance from "../../artifacts/contracts/Covid_Insurance.sol/Covid_Insurance.json";

import Web3 from 'web3'
import * as contract_end_point from '../../contract_deployed_endpoint';


const Insurance_contract = web3 => {
     return new web3.eth.Contract(Covid_Insurance.abi, contract_end_point.covid_Insurance_contract_Addr);
}

export {Insurance_contract}