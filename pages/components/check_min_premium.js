import React from 'react'

export default function Check_min_premium(props) {
  return (
    <div>
        <div className="d-inline-flex align-items-center w-50 mt-1">
        <h3 className="mt-3">
            Check min/max premium 
          </h3>
            <button type="submit"  onClick={props.get_min_max_value}  className="btn btn-primary mx-3">Min/Max Premium in Eth/Benefits</button>
        </div>
        <br/>
        <br/>
          <p> Min Premium is {props.min_premium} Eth with Benefit  {props.min_benefit} times of premium value</p>
          <br />
          <p> Max Premium is {props.max_premium}  Eth with Benefit  {props.max_benefit}  times of premium value</p>
    </div>
  )
}
