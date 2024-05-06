import React, {useState} from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Script from "react-load-script";
import { Form, Button } from "react-bootstrap";
import Modal from 'react-modal';
import axios from 'axios'
import { Input } from 'antd';

let OmiseCard
const Checkout = () => {
  let initialValues = {
    firstName: '',
    lastName: '',
    email: ''
  }
  const state = useSelector((state) => state.handleCart);
  const [item, setItem] = useState({ kindOfStand: "", another: "another" });
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [profile, setProfile] = useState(initialValues)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const onChange = (e) => {
    console.log(e.target.name)
    console.log(e.target.value)
    setProfile({...profile, [e.target.name]: e.target.value});
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      width:'50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleLoadScript = () => {
    OmiseCard = window.OmiseCard
    OmiseCard.configure({
      publicKey: 'pkey_test_5cavgpd60nnvc4a2ey3',
      currency: 'THB',
      amount: state.map((item) => {
        return (item.price * item.qty * 100);
      }),
      frameLabel: 'Keyboard Shop',
      submitLabel: 'Pay NOW',
      buttonLabel: 'Pay with Omise'
    });
  }

  const creditCardConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: 'credit_card',
      otherPaymentMethods: []
    });
    OmiseCard.configureButton("#credit-card");
    OmiseCard.attach();
  }

  const omiseCardHandler = () => {
    OmiseCard.open({
      amount: state.map((item) => {
        return (item.price * item.qty * 100);
      }),
      onCreateTokenSuccess: (token) => {
        axios.post(`http://127.0.0.1:8080/payment`, {
          email: "akarasek.k@gmail.com",
          name: 'sek',
          amount: state.map((item) => {
            return (item.price * item.qty * 100);
          }),
          token: token,
          headers: {
            "Content-Type": "application/json"
          }
        })
      },
      onFormClosed: () => { },
    })
  }

  const cryptoPayment = () => {
        axios.post(`http://127.0.0.1:8080/payment-crypto`, {
          email: "akarasek.k@gmail.com",
          name: 'sek',
          amount: state.map((item) => {
            return (item.price * item.qty);
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
  }

  const QRConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: 'promptpay',
      otherPaymentMethods: []
    });
    OmiseCard.configureButton("#promptpay");
    OmiseCard.attach();
  }

  const handleClick = (e) => {
    e.preventDefault();
    creditCardConfigure();
    omiseCardHandler()
  }

  const handleClickQR = (e) => {
    e.preventDefault();
    QRConfigure();
  }

  const handleChangeRadio = e => {
    e.persist();
    console.log(e.target.value);

    setItem(prevState => ({
      ...prevState,
      kindOfStand: e.target.value
    }));
  };

  // const checkoutWithCreditCard = () =>{
  //   const tokenParameters = {
  //     expiration_month: 12,
  //     expiration_year: 25,
  //     name: 'sek',
  //     number: '4242424242424242',
  //     security_code: '123',
  //   };
  //
  //   let _this = this
  //
  //   Omise.setPublicKey("OMISE_PUBLIC_KEY");
  //   Omise.createToken("card",
  //       tokenParameters,
  //       function (statusCode, response) {
  //         // response["id"] is token identifier
  //         console.log(response)
  //         //_this.chargeCredit(response.id);
  //       });
  //
  //   // let resp = await this.paymentService.getOmiseToken$(tokenParameters);
  //   // console.log('resp check token', resp)
  //   // this.chargeCredit(resp.id);
  // }

  const ShowPaymentCrypto = () => {
    let subtotal = 0;
    let totalItems = 0;
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    return (
        <>

          <hr className="my-4" />

          <h4 className="mb-3">Payment By Crypto</h4>
                  <div className="card-body">
                    <form className="needs-validation" noValidate>
                      <div className="row gy-3">
                        <div className="col-md-3">
                          <label htmlFor="cc-name" className="form-label">
                            Network Name:
                          </label>
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="cc-name" className="form-label">
                            BSC
                          </label>
                        </div>
                      </div>
                      <div className="row gy-3">
                        <div className="col-md-3">
                          <label htmlFor="cc-expiration" className="form-label">
                            Coin Name:
                          </label>
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="cc-expiration" className="form-label">
                            USDT
                          </label>
                        </div>
                      </div>
                      <div className="row gy-3">
                        <div className="col-md-3">
                          <label htmlFor="cc-expiration" className="form-label">
                            Wallet Name:
                          </label>
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="cc-expiration" className="form-label">
                            0x5A46EDD2AeD119d576cDB3e3C6835918AEb61bC1
                          </label>
                        </div>
                      </div>

                      <hr className="my-4"/>

                      <button
                          className="w-100 btn btn-primary "
                          type="submit"
                      >
                        Continue to checkout
                      </button>
                    </form>
                  </div>
        </>
    );
  };

  const ShowPaymentCredit = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    return (
        <>
          <hr className="my-4" />

          <h4 className="mb-3">Payment By Credit Card</h4>
          <div className="card-body">
            <form className="needs-validation" noValidate>
              <div className="row gy-3">
                <div className="col-md-6">
                  <label htmlFor="cc-name" className="form-label">
                    Name on card
                  </label>
                  <Input
                      type="text"
                      className="form-control"
                      id="cc-name"
                      placeholder=""
                      required
                  />
                  <small className="text-muted">
                    Full name as displayed on card
                  </small>
                  <div className="invalid-feedback">
                    Name on card is required
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="cc-number" className="form-label">
                    Credit card number
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="cc-number"
                      placeholder=""
                      min="19" max="19"
                      required
                  />
                  <div className="invalid-feedback">
                    Credit card number is required
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="cc-expiration" className="form-label">
                    Month Expiration
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="cc-expiration"
                      placeholder=""
                      required
                  />
                  <div className="invalid-feedback">
                    Expiration date required
                  </div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="cc-cvv" className="form-label">
                    Year Expiration
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="cc-cvv"
                      placeholder=""
                      required
                  />
                  <div className="invalid-feedback">
                    Security code required
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="cc-cvv" className="form-label">
                    CVV
                  </label>
                  <input
                      type="text"
                      className="form-control"
                      id="cc-cvv"
                      placeholder=""
                      required
                  />
                  <div className="invalid-feedback">
                    Security code required
                  </div>
                </div>
              </div>

              <hr className="my-4"/>

              <button
                  className="w-100 btn btn-primary "
                  type="button"
              >
                Continue to checkout 2
              </button>
            </form>
          </div>
        </>
    );
  };

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    return (
      <>
        <Script
            url="https://cdn.omise.co/omise.js"
            onLoad={handleLoadScript}
        />
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})<span>${subtotal}</span>
                    </li>
                    {/*<li className="list-group-item d-flex justify-content-between align-items-center px-0">*/}
                    {/*  Shipping*/}
                    {/*  <span>${shipping}</span>*/}
                    {/*</li>*/}
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${subtotal}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" novalidate>
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label for="firstName" className="form-label">
                          First name
                        </label>
                        <Input
                          key={'firstName'}
                          autoFocus="autoFocus"
                          placeholder=""
                          value={firstName}
                          onChange={(e)=>setFirstName(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Valid first name is required.
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label for="lastName" className="form-label">
                          Last name
                        </label>
                        <Input
                          key={'lastName'}
                          id="lastName"
                          placeholder=""
                          value={lastName}
                          required
                          onChange={(e)=>setLastName(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Valid last name is required.
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label for="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="you@example.com"
                          value={profile.email || "" }
                          required
                          onChange={ onChange }
                        />
                        <div className="invalid-feedback">
                          Please enter a valid email address for shipping
                          updates.
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label for="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="1234 Main St"
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter your shipping address.
                        </div>
                      </div>

                      <div className="col-12">
                        <label for="address2" className="form-label">
                          Address 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          placeholder="Apartment or suite"
                        />
                      </div>

                      <div className="col-md-5 my-1">
                        <label for="country" className="form-label">
                          Country
                        </label>
                        <br />
                        <select className="form-select" id="country" required>
                          <option value="">Choose...</option>
                          <option>Thailand</option>
                        </select>
                        <div className="invalid-feedback">
                          Please select a valid country.
                        </div>
                      </div>

                      <div className="col-md-4 my-1">
                        <label for="state" className="form-label">
                          State
                        </label>
                        <br />
                        <select className="form-select" id="state" required>
                          <option value="">Choose...</option>
                          <option>Bangkok</option>
                        </select>
                        <div className="invalid-feedback">
                          Please provide a valid state.
                        </div>
                      </div>

                      <div className="col-md-3 my-1">
                        <label for="zip" className="form-label">
                          Zip
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Zip code required.
                        </div>
                      </div>
                    </div>


                    <hr className="my-4" />

                    <h4 className="mb-3">Payment Method</h4>
                    {/*<Form.Group controlId="kindOfStand">*/}
                    {/*  <Form.Check*/}
                    {/*      value="crypto"*/}
                    {/*      type="radio"*/}
                    {/*      aria-label="radio 1"*/}
                    {/*      label="Crypto"*/}
                    {/*      onChange={handleChangeRadio}*/}
                    {/*      checked={kindOfStand === "crypto"}*/}
                    {/*  />*/}
                    {/*  <Form.Check*/}
                    {/*      value="credit"*/}
                    {/*      type="radio"*/}
                    {/*      aria-label="radio 2"*/}
                    {/*      label="Credit"*/}
                    {/*      onChange={handleChangeRadio}*/}
                    {/*      checked={kindOfStand === "credit"}*/}
                    {/*  />*/}
                    {/*  <Form.Check*/}
                    {/*      value="qr"*/}
                    {/*      type="radio"*/}
                    {/*      aria-label="radio 2"*/}
                    {/*      label="QR"*/}
                    {/*      onChange={handleChangeRadio}*/}
                    {/*      checked={kindOfStand === "qr"}*/}
                    {/*  />*/}
                    {/*</Form.Group>*/}
                    {/*{kindOfStand === 'crypto' ? <ShowPaymentCrypto /> : kindOfStand === 'credit' ? <ShowPaymentCredit /> : ''}*/}
                    <div className="col-md-5 my-1">
                      <button className="w-100 btn btn-primary "
                              id="crypto"
                              type="button"
                              onClick={openModal}

                      >
                        Pay with Crypto
                      </button>
                    </div>
                    <div className="col-md-5 my-1">
                      <button className="w-100 btn btn-primary"
                          id="credit-card"
                          type="button"
                          onClick={handleClick}

                      >
                        Pay with Credit Card
                      </button>
                    </div>
                    <div className="col-md-5 my-1">
                    <button className="w-100 btn btn-primary "
                        id="promptpay"
                        type="button"
                        onClick={handleClickQR}

                    >
                      Pay with QR
                    </button>
                    </div>
                  </form>

                  <hr className="my-4" />
                  <Modal
                      isOpen={modalIsOpen}
                      onRequestClose={closeModal}
                      style={customStyles}
                      contentLabel="Example Modal"
                  >
                    <>

                      <hr className="my-4" />

                      <h4 className="mb-3">Payment By Crypto</h4>
                      <div className="card-body">
                        <form className="needs-validation" noValidate>
                          <div className="row gy-3">
                            <div className="col-md-3">
                              <label htmlFor="cc-name" className="form-label">
                                Network Name:
                              </label>
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="cc-name" className="form-label">
                                BSC
                              </label>
                            </div>
                          </div>
                          <div className="row gy-3">
                            <div className="col-md-3">
                              <label htmlFor="cc-expiration" className="form-label">
                                Coin Name:
                              </label>
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="cc-expiration" className="form-label">
                                USDT
                              </label>
                            </div>
                          </div>
                          <div className="row gy-3">
                            <div className="col-md-3">
                              <label htmlFor="cc-expiration" className="form-label">
                                Wallet Name:
                              </label>
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="cc-expiration" className="form-label">
                                0x5A46EDD2AeD119d576cDB3e3C6835918AEb61bC1
                              </label>
                            </div>
                          </div>

                          <hr className="my-4"/>

                          <button
                              className="w-100 btn btn-primary " onClick={cryptoPayment}
                              type="submit"
                          >
                            Continue to checkout
                          </button>
                        </form>
                      </div>
                    </>
                  </Modal>

                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };



  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}

      </div>
      <Footer />
    </>
  );
};

export default Checkout;
