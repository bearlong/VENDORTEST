import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/application.module.scss'
import VendorData from '@/data/vendor.json'
import PartsData from '@/data/parts.json'
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CButtonGroup,
  CTable,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CPopover,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
} from '@coreui/react'
import Swal from 'sweetalert2'

export default function Index() {
  const [addItems, setAddItems] = useState(false)
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState({})
  const [vendorData, setVendorData] = useState([])
  const [partsData, setPartsData] = useState([])
  const [selectedVendor, setSelectedVendor] = useState(null) // 用於儲存選中的 Vendor
  const [inputVendors, setInputVendors] = useState([])
  const [chooseParts, setChooseParts] = useState(null)
  const rate = {
    USD: { USD: 1, EUR: 0.91, NTD: 30.25 },
    EUR: { USD: 1.1, EUR: 1, NTD: 33.33 },

    NTD: { USD: 0.033, EUR: 0.03, NTD: 1 },
  }
  const columns = [
    {
      key: 'id',
      label: 'item',
      _props: { scope: 'col' },
    },
    {
      key: 'Factory',
      _props: { scope: 'col' },
    },
    {
      key: 'Brand',
      label: 'Brand',
      _props: { scope: 'col' },
    },
    {
      key: 'Vendor',
      label: 'Vendor',
      _props: { scope: 'col' },
    },
    {
      key: 'Parts',
      label: 'Parts',
      _props: { scope: 'col' },
    },
    {
      key: 'Deacription',
      label: 'Deacription',
      _props: { scope: 'col' },
    },
    {
      key: 'OrderSharerate',
      label: 'Order Sharerate (%)',
      _props: { className: `${styles.ch7}`, scope: 'col' },
    },
    {
      key: 'LastPutPrice',
      label: 'Last Put Price',
      _props: { scope: 'col' },
    },
    {
      key: 'CurrencyOld',
      label: 'Currency',
      _props: { scope: 'col' },
    },
    {
      key: 'UnitPrice',
      label: 'Unit Price',
      _props: { scope: 'col' },
    },
    {
      key: 'CurrencyNew',
      label: 'Currency',
      _props: { scope: 'col' },
    },
    {
      key: 'Rate',
      label: 'Rate',
      _props: { scope: 'col' },
    },
    {
      key: 'EffectiveDate',
      label: 'Effective Date (yyyy/mm/dd)',
      _props: { className: `${styles.dateInput}`, scope: 'col' },
    },
    {
      key: 'EffectiveRemark',
      label: 'Effective Remark',
      _props: { scope: 'col' },
    },
    {
      key: 'CostDown',
      label: 'Cost Down (%)',
      _props: { className: `${styles.ch7}`, scope: 'col' },
    },
    {
      key: 'Moq',
      label: 'Moq',
      _props: { scope: 'col' },
    },
    {
      key: 'Mpq',
      label: 'Mpq',
      _props: { scope: 'col' },
    },
    {
      key: 'LeadTime',
      label: 'LeadTime',
      _props: { scope: 'col' },
    },
    {
      key: 'AttachFile',
      label: 'Attach File',
      _props: { scope: 'col' },
    },
  ]

  const factoryOptions = [
    { id: 1, label: 'PHC', value: 'PHC' },
    { id: 2, label: 'PHP', value: 'PHP' },
    { id: 3, label: 'PHS', value: 'PHS' },
    { id: 4, label: 'PHT', value: 'PHT' },
    { id: 5, label: 'PHTJ', value: 'PHTJ' },
    { id: 6, label: 'PHZ', value: 'PHZ' },
    { id: 7, label: '固昌', value: '固昌' },
    { id: 8, label: '冠盈', value: '冠盈' },
  ]

  const handleAddRow = () => {
    const rowId = items.length + 1

    const prevInput = {
      id: rowId,
      Factory: '',
      Brand: '',
      Vendor: '',
      Parts: '',
      Deacription: '',
      OrderSharerate: '',
      LastPutPrice: '',
      CurrencyOld: 'NTD',
      UnitPrice: '',
      CurrencyNew: 'NTD',
      Rate: '',
      EffectiveDate: '',
      EffectiveRemark: '',
      CostDown: '',
      Moq: '',
      Mpq: '',
      LeadTime: '',
      AttachFile: '',
      isEdit: true,
      _cellProps: { id: { scope: 'row' } },
    }

    setItems([...items, prevInput])
    setAddItems(true)
  }

  const handleInput = (id, fieldName, value) => {
    const newItem = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [fieldName]: value,
        }
      }
      return item
    })
    setItems(newItem)
  }

  const handleAddItem = () => {
    if (handleCheckEmpty()) {
      const updatedItems = items.map((item) => ({
        ...item,
        isEdit: false, // 將所有現有項目的 isEdit 改為 false
      }))
      setItems(updatedItems)
      setAddItems(false)
    }
  }

  const handleCheckEmpty = () => {
    const emptyItems = items.some(
      (item) =>
        item.isEdit &&
        Object.keys(item).some((key) => key !== 'AttachFile' && !item[key])
    )
    if (emptyItems) {
      Swal.fire({
        title: 'Please ensure all fields are filled in.',
        text: 'All fields are required except for the attachment.',
        icon: 'error',
      })
      return false
    }
    return true
  }

  const handleCheckFactory = (id, value) => {
    const currentFactory = items.find((i) => i.id === id)?.Factory || ''

    let newValue
    const factoryArray = currentFactory.split(',').map((item) => item.trim())
    if (factoryArray.includes(value)) {
      newValue = factoryArray.filter((item) => item !== value).join(',')
    } else {
      newValue = factoryArray.length ? `${currentFactory},${value}` : value
    }

    newValue = newValue.replace(/^,|,$/g, '')
    const newItem = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          Factory: newValue,
        }
      }
      return item
    })
    setItems(newItem)
  }

  const handleVendorSearch = (query) => {
    setVendorData(filterVendors(VendorData, query))
  }

  const filterVendors = (vendors, query) =>
    vendors.filter((vendor) =>
      Object.values(vendor).some((field) =>
        String(field).toLowerCase().includes(query.toLowerCase())
      )
    )

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVendorSearch(e.target.value)
    }
  }

  const handleGetRateKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGetRate(e)
    }
  }

  const handleGetRate = (e) => {
    const itemId = Number(e.target.id)
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const exchangeRate = rate[item.CurrencyOld]?.[item.CurrencyNew] || 0 // 安全訪問匯率
          const costDownRate = calculateCostDown(
            Number(item.LastPutPrice),
            Number(item.UnitPrice),
            exchangeRate
          )
          return {
            ...item,
            Rate: exchangeRate,
            CostDown:
              costDownRate === 0 ? 0 : parseFloat(costDownRate).toFixed(2), // 保留小數點後兩位
          }
        }
        return item
      })
    )
  }

  const calculateCostDown = (lastPutPrice, unitPrice, exchangeRate) => {
    if (lastPutPrice === 0) return 0
    return (
      ((lastPutPrice * exchangeRate - unitPrice) /
        (lastPutPrice * exchangeRate)) *
      100
    ).toFixed(2)
  }

  const handleVendorSelect = (v) => {
    setSelectedVendor(v) // 更新選中的 Vendor
  }

  const handleAddVendor = () => {
    if (selectedVendor) {
      // 將選中的 Vendor 添加到輸入清單
      setInputVendors((prev) => [
        ...prev,
        `(${selectedVendor.id})${selectedVendor.nameEn}(${selectedVendor.nameZh})`,
      ])
    }
  }

  const handleSelectParts = () => {
    const vendorIds = inputVendors
      .map((vendor) => {
        const match = vendor.match(/\(([^)]+)\)/) // 匹配括號內的任意內容
        return match ? match[1] : null // 提取括號內的值
      })
      .filter(Boolean) // 移除 null 值

    // 過濾 PartsData 中符合的項目
    const newParts = PartsData.filter((part) => vendorIds.includes(part.vendor))
    setPartsData(newParts)
  }

  const handleClose = () => {
    setVisible(false)
    setVendorData([])
    setSelectedVendor(null) // 重置選中的 Vendor
    setInputVendors([]) // 清空輸入清單
    setChooseParts(null) // 重置選中的 Parts
  }

  const handleChoosePart = (id) => {
    setChooseParts(id)
  }

  const handleSendPart = (id, partId) => {
    const choosePart = partsData.find((part) => part.id === partId)
    const vendor = VendorData.find((vendor) => vendor.id === choosePart.vendor)

    const newItem = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          Vendor: `(${vendor.id})${vendor.nameEn}`,
          Parts: choosePart.parts,
          Deacription: choosePart.description,
          LastPutPrice: choosePart.lastPutPrice,
          CurrencyOld: choosePart.currencyOld,
        }
      }
      return item
    })
    setItems(newItem)
    handleClose()
  }

  const handleOpenModal = (id) => {
    setVisible((prev) => ({ ...prev, [id]: true }))
  }

  const handleCloseModal = (id) => {
    setVisible((prev) => ({ ...prev, [id]: false }))
  }

  useEffect(() => {
    handleSelectParts()
  }, [inputVendors])

  return (
    <>
      <main className={'bg'}>
        <div
          className={` m-0  fw-bold d-flex justify-content-end align-items-end`}
        >
          <CButton className="me-5" color="primary" size="lg">
            Primary
          </CButton>
          <Link className="h4 m-0 me-5" href={'#'}>
            User Help
          </Link>
        </div>
        <div className={` px-4 pt-5 container d-flex justify-content-center`}>
          <div className="d-inline-block text-center">
            <h1
              className={`display-4 fw-bold text-center primary d-flex justify-content-center align-items-center mb-3`}
            >
              <Image
                className="me-2 "
                src="/img/logo.png"
                width={30}
                height={30}
                alt="logo"
              />
              VENDOR Compare Price Application Form
            </h1>
            <h3 className="text-end mb-5">Date： 2024/11/18</h3>
            <CContainer className="border h3 border-3">
              <CRow>
                <CCol className={`${styles.hlColor} py-4 border border-3`}>
                  Application No.
                </CCol>
                <CCol className="py-4 border border-3">申請單編號</CCol>
                <CCol className={`${styles.hlColor} py-4 border border-3`}>
                  Sourcer
                </CCol>
                <CCol className="py-4 border border-3">申請人</CCol>
              </CRow>
              <CRow>
                <CCol className={`${styles.hlColor} py-5 border border-3`}>
                  MEMO
                </CCol>
                <CCol className="p-0 border border-3" xs={9}>
                  <textarea
                    className="w-100 px-2"
                    name=""
                    id=""
                    rows={4}
                    style={{
                      resize: 'none',
                      overflow: 'auto',
                    }}
                  ></textarea>
                </CCol>
              </CRow>
            </CContainer>
          </div>
        </div>
        <div className="container mb-5">
          <CButtonGroup
            className=" mx-5"
            role="group"
            aria-label="Basic example"
            size="lg"
          >
            <CButton color="secondary">ADD Multiple ITEM</CButton>
            <CButton color="secondary">ADD Multiple VENDOR</CButton>
            <CButton color="secondary" onClick={handleAddRow}>
              ADD ITEM
            </CButton>
            <CButton color="secondary">Cancel Apply</CButton>
            <CButton color="secondary">New Apply</CButton>
          </CButtonGroup>
        </div>
        <CTable
          className={`h5 text-center ${styles.formApplication} mb-5`}
          columns={columns}
          items={items.map((item) => ({
            ...item,
            Factory: item.isEdit ? (
              <>
                <div className="d-flex justify-content-center align-items-center position-relative">
                  <CFormInput
                    type="text"
                    value={items.find((i) => i.id === item.id)?.Factory || ''}
                    onChange={(e) => {
                      handleInput(item.id, 'Factory', e.target.value)
                    }}
                  />
                  <CPopover
                    className={styles.factoryList}
                    content={factoryOptions.map((option) => (
                      <CFormCheck
                        key={option.id}
                        type="checkbox"
                        className="h5"
                        name={`Factory${item.id}_${option.id}`}
                        id={`Factory${item.id}_${option.id}`}
                        label={option.label}
                        value={option.value}
                        onChange={(e) =>
                          handleCheckFactory(item.id, e.target.value)
                        }
                        checked={items
                          .find((i) => i.id === item.id)
                          ?.Factory?.split(',')
                          .includes(option.value)}
                      />
                    ))}
                    title="Factory List"
                    placement="right"
                  >
                    <CButton color="primary">Select</CButton>
                  </CPopover>
                </div>
              </>
            ) : (
              item.Factory || ''
            ),
            Brand: item.isEdit ? (
              <>
                <div className="d-flex h-100 justify-content-center align-items-center">
                  <CFormInput
                    type="text"
                    onChange={(e) =>
                      handleInput(item.id, 'Brand', e.target.value)
                    }
                  />
                </div>
              </>
            ) : (
              item.Brand || ''
            ),
            Vendor: item.isEdit ? (
              <>
                <div className="d-flex  justify-content-center align-items-center">
                  <CFormInput
                    type="text"
                    disabled
                    onChange={(e) =>
                      handleInput(item.id, 'Vendor', e.target.value)
                    }
                    value={item.Vendor}
                  />
                  <CButtonGroup role="group" aria-label="Basic example">
                    <CButton
                      color="primary"
                      onClick={() => handleOpenModal(item.id)}
                    >
                      Select
                    </CButton>
                    <CButton color="primary">Del</CButton>
                  </CButtonGroup>
                </div>
                <CModal
                  alignment="center"
                  visible={!!visible[item.id]}
                  onClose={() => handleCloseModal(item.id)}
                  aria-labelledby={`model${item.id}`}
                  backdrop="static"
                >
                  <CModalHeader className="text-center" closeButton={false}>
                    <CModalTitle id={`model${item.id}`} className="primary h3 ">
                      Select Vendor Form
                    </CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <div className="mb-2 border  border-1 p-2 border-secondary-subtle">
                      <h4 className="primary">Input Vendor List</h4>
                      <CFormTextarea
                        id={`inputVendor${item.id}`}
                        rows={3}
                        disabled
                        value={inputVendors.join('\n')}
                      ></CFormTextarea>
                    </div>
                    <div className="mb-2 border  border-1 p-2 border-secondary-subtle">
                      <h4 className="primary">Search Vendor Name</h4>
                      <span>
                        (Search EX:{' '}
                        <span className="text-primary">
                          TOKYO PARTS(東京元件)
                        </span>{' '}
                        Search Input: <span className="text-danger">T*</span>
                        <span className="text-danger-emphasis">ENTER</span> )
                      </span>
                      <CFormInput type="text" onKeyDown={handleInputKeyDown} />
                    </div>
                    <div className="mb-2 border  border-1 p-2 border-secondary-subtle">
                      <h4 className="primary">Select Vendor</h4>
                      {vendorData.map((v, i) => {
                        return (
                          <CFormCheck
                            key={v.id}
                            type="radio"
                            name={`vendor${item.id}`}
                            id={`vendor${i}_${item.id}`}
                            label={`(${v.id})${v.nameEn}(${v.nameZh})`}
                            value={v.id}
                            onChange={() => {
                              handleVendorSelect(v)
                            }}
                            checked={selectedVendor?.id === v.id}
                          />
                        )
                      })}
                    </div>
                    <div className="mb-2 border  border-1 p-2 border-secondary-subtle">
                      <h4 className="primary">Select Parts</h4>
                      {partsData.map((p, i) => {
                        return (
                          <CFormCheck
                            key={i}
                            type="radio"
                            name={`parts${item.id}`}
                            id={`parts${i}_${item.id}`}
                            value={p.id}
                            label={
                              <>
                                {p.parts}
                                <span style={{ color: 'blue' }}>
                                  {' '}
                                  ({p.description})
                                </span>
                              </>
                            }
                            onChange={() => {
                              handleChoosePart(p.id)
                            }}
                            checked={chooseParts === p.id}
                          />
                        )
                      })}
                    </div>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        handleClose()
                      }}
                    >
                      Close
                    </CButton>
                    <CButton
                      color="primary"
                      onClick={() => {
                        handleAddVendor()
                        console.log(item)
                      }}
                    >
                      ADD Vendor
                    </CButton>
                    <CButton
                      color="primary"
                      onClick={() => {
                        handleSendPart(item.id, chooseParts)
                      }}
                    >
                      Send OK
                    </CButton>
                  </CModalFooter>
                </CModal>
              </>
            ) : (
              item.Vendor || ''
            ),
            Parts: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  onChange={(e) =>
                    handleInput(item.id, 'Parts', e.target.value)
                  }
                  value={item.Parts}
                />
              </>
            ) : (
              item.Parts || ''
            ),
            Deacription: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  onChange={(e) =>
                    handleInput(item.id, 'Deacription', e.target.value)
                  }
                  value={item.Deacription}
                />
              </>
            ) : (
              item.Deacription || ''
            ),
            OrderSharerate: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  onChange={(e) =>
                    handleInput(item.id, 'OrderSharerate', e.target.value)
                  }
                />
              </>
            ) : (
              item.OrderSharerate || ''
            ),
            LastPutPrice: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  onChange={(e) =>
                    handleInput(item.id, 'LastPutPrice', e.target.value)
                  }
                  value={item.LastPutPrice}
                />
              </>
            ) : (
              item.LastPutPrice || ''
            ),
            CurrencyOld: item.isEdit ? (
              <CFormSelect
                aria-label="Default select example"
                options={[
                  { label: 'NTD', value: 'NTD' },
                  { label: 'EUR', value: 'EUR' },
                  { label: 'USD', value: 'USD' },
                ]}
                onChange={(e) =>
                  handleInput(item.id, 'CurrencyOld', e.target.value)
                }
                value={item.CurrencyOld}
              />
            ) : (
              item.CurrencyOld || ''
            ),
            UnitPrice: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  id={item.id.toString()}
                  onChange={(e) =>
                    handleInput(item.id, 'UnitPrice', e.target.value)
                  }
                  onKeyDown={handleGetRateKeyDown}
                />
              </>
            ) : (
              item.UnitPrice || ''
            ),
            CurrencyNew: item.isEdit ? (
              <>
                <CFormSelect
                  aria-label="Default select example"
                  options={[
                    { label: 'NTD', value: 'NTD' },
                    { label: 'EUR', value: 'EUR' },
                    { label: 'USD', value: 'USD' },
                  ]}
                  onChange={(e) =>
                    handleInput(item.id, 'CurrencyNew', e.target.value)
                  }
                  value={item.CurrencyNew}
                />
              </>
            ) : (
              item.CurrencyNew || ''
            ),
            Rate: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  maxLength={5}
                  style={{ width: '7ch' }}
                  onChange={(e) => handleInput(item.id, 'Rate', e.target.value)}
                  value={rate[item.CurrencyOld][item.CurrencyNew] || ''}
                  disabled
                />
              </>
            ) : (
              item.Rate || ''
            ),
            EffectiveDate: item.isEdit ? (
              <>
                <CFormInput
                  type="date"
                  onChange={(e) =>
                    handleInput(item.id, 'EffectiveDate', e.target.value)
                  }
                />
              </>
            ) : (
              item.EffectiveDate || ''
            ),
            EffectiveRemark: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  onChange={(e) =>
                    handleInput(item.id, 'EffectiveRemark', e.target.value)
                  }
                />
              </>
            ) : (
              item.EffectiveRemark || ''
            ),
            CostDown: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  onChange={(e) =>
                    handleInput(item.id, 'CostDown', e.target.value)
                  }
                  value={item.CostDown}
                />
              </>
            ) : (
              item.CostDown || ''
            ),
            Moq: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  style={{ width: '7ch' }}
                  onChange={(e) => handleInput(item.id, 'Moq', e.target.value)}
                />
              </>
            ) : (
              item.Moq || ''
            ),
            Mpq: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  style={{ width: '7ch' }}
                  onChange={(e) => handleInput(item.id, 'Mpq', e.target.value)}
                />
              </>
            ) : (
              item.Mpq || ''
            ),
            LeadTime: item.isEdit ? (
              <>
                <CFormInput
                  type="text"
                  onChange={(e) =>
                    handleInput(item.id, 'LeadTime', e.target.value)
                  }
                />
              </>
            ) : (
              item.LeadTime || ''
            ),
            AttachFile: item.isEdit ? (
              <div className="d-flex  justify-content-center align-items-center">
                <CFormInput
                  type="file"
                  id="formFileSm"
                  onChange={(e) =>
                    handleInput(item.id, 'AttachFile', e.target.value)
                  }
                />
              </div>
            ) : (
              item.AttachFile || ''
            ),
            _cellProps: { id: { scope: 'row' } },
          }))}
          bordered
          borderColor="dark"
          tableHeadProps={{ color: 'primary' }}
          color="light"
        />
        <div className="d-flex gap-5 justify-content-center">
          <CButton
            color="secondary"
            className={`${styles.ch15} m-0`}
            onClick={() => {
              addItems ? handleAddItem() : ''
            }}
          >
            {addItems ? 'ADD Item' : 'SEND'}
          </CButton>
          <CButton color="secondary" className={styles.ch15}>
            {addItems ? 'Bom' : 'Exit'}
          </CButton>
        </div>
      </main>
    </>
  )
}
