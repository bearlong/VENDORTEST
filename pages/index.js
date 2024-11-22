// pages/index.js
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { CNav, CNavItem, CNavLink, CFormCheck } from '@coreui/react'
import {
  FaAsterisk,
  FaMoneyBill,
  FaSearchengin,
  FaCheck,
} from 'react-icons/fa6'
import styles from '@/styles/homePage.module.scss'
import Link from 'next/link'

export default function Home() {
  const [isChecked, setIsChecked] = useState(false)

  // 處理切換狀態
  const handleCheckChange = () => {
    setIsChecked((prev) => !prev)
  }
  return (
    <>
      <main className="bg">
        <h1 className={` m-0 display-5 fw-bold text-body-emphasis`}>
          Next + Bootstrap5 + coreUI 範例
        </h1>
        <div className={` px-4 pt-5 container`}>
          <h1
            className={`display-4 fw-bold text-center primary d-flex justify-content-center align-items-center`}
          >
            <Image
              className="me-2"
              src="/img/logo.png"
              width={30}
              height={30}
              alt="logo"
            />{' '}
            Main From
          </h1>
          <CFormCheck
            button={{ color: 'primary', variant: 'outline' }}
            id="btn-check-outlined"
            autoComplete="off"
            className="d-flex justify-content-center align-items-center"
            checked={isChecked}
            onChange={handleCheckChange}
            label={
              <>
                <span className="d-flex align-items-center h3">
                  <FaAsterisk size={16} className="me-2" /> Vendor Compare Price
                  System
                </span>
              </>
            }
          />

          <CNav
            className={`flex-column h3 justify-content-center align-items-start mt-3 ${
              isChecked ? 'd-flex' : 'd-none'
            }`}
            variant="underline"
          >
            <CNavItem>
              <CNavLink href="/Application">
                <span className="d-flex align-items-center h3">
                  <FaMoneyBill size={16} className="me-2" /> Vendor Compare
                  Price Application
                </span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">
                <span className="d-flex align-items-center h3">
                  <FaSearchengin size={16} className="me-2" /> Vendor Compare
                  Price Application Query
                </span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">
                <span className="d-flex align-items-center h3">
                  <FaCheck size={16} className="me-2" /> Vendor Compare Price
                  Application Signature
                </span>
              </CNavLink>
            </CNavItem>
          </CNav>
        </div>
      </main>
      <style global jsx>
        {`
          .card-cover {
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
          }

          .text-shadow-1 {
            text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
          }
          .text-shadow-2 {
            text-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.25);
          }
          .text-shadow-3 {
            text-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.25);
          }
        `}
      </style>
    </>
  )
}
