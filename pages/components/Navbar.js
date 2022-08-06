import React from 'react'
import Link from 'next/link'
import Head from 'next/head'

export default function Navbar() {
  return (
    <>
    <div>
      <Head>
        <title>Auction DApp</title>
        <meta name="description" content="By priya" />
      </Head>
    <div> 
        <nav className="navbar navbar-expand-lg navbar-light bg-secondary fs-5">
        <a className="navbar-brand" href="#"></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav nav-fill">
            <li className="nav-item">
            <Link href='/about'>
                <a className="nav-link  text-white" href="#">About</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href='/purchase'>
                <a className="nav-link  text-white" href="#">purchase</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href='claim'>
                    <a className="nav-link  text-white" href="#">claim</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href='/admin'>
                    <a className="nav-link  text-white" href="#">Admin Only</a>
                </Link>
            </li>
            </ul>
        </div>
        </nav>
    </div>
    </div>
  </>
  )
}