import React from 'react';
import axios from 'axios';
import StaticAddToCart from './StaticAddToCart.jsx';
import DynamicAddToCart from './DynamicAddToCart.jsx';
import Cart from './Cart.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      price: 0,
      deliveryDate: '',
      storeName: '',
      storeLogo: '',
      storeMinimumFreeShipping: 0,
      itemNum: 0,
      subtotal: 0,
      clicked: false
    };
    this.getItemInfo = this.getItemInfo.bind(this);
    this.onStaticAddToCartClicked = this.onStaticAddToCartClicked.bind(this);
    this.onMinusSignClicked = this.onMinusSignClicked.bind(this);
    this.onPlusSignClicked = this.onPlusSignClicked.bind(this);
    this.revertState = this.revertState.bind(this);
  }

  getItemInfo(id){
    // let id = parseInt(window.location.pathname.split('/')[2], 10);
    axios.get(`http://localhost:3003/item/${id}/sidebar`)
      .then((response) => {
        this.setState({price: response.data[0].price,
                      deliveryDate: response.data[0].itemDeliveryTime,
                      storeName: response.data[0].storeName,
                      storeLogo: response.data[0].storeLogo,
                      storeMinimumFreeShipping: response.data[0].storeMinimumFreeShipping
                    })
                  })
      .catch((error) => {
        console.log('Error getting data through axios: ', error);
      })
  };

  componentDidMount() {
    this.getItemInfo(parseInt(window.location.pathname.split('/')[2], 10));
  };

  onStaticAddToCartClicked(e) {
    e.preventDefault;
    console.log(this.state.itemNum);
    this.setState({itemNum: 1,
                  subtotal: this.state.price,
                  clicked: true}, () => {
                    //console.log(this.state.itemNum);
                    //console.log(this.state.subtotal);
                  });
    this.revertState();
  }

  onMinusSignClicked(e) {
    e.preventDefault;
    this.setState({itemNum: this.state.itemNum - 1,
                  subtotal: this.state.subtotal - this.state.price,
                  clicked: true}, () => {
                    //console.log(this.state.itemNum);
                    //console.log(this.state.subtotal);
                  });
    this.revertState();
  }

  onPlusSignClicked(e) {
    e.preventDefault;
    this.setState({itemNum: this.state.itemNum + 1,
                  subtotal: this.state.subtotal + this.state.price,
                  clicked: true}, () => {
                    //console.log(this.state.itemNum);
                    //console.log(this.state.subtotal);
                  });
    this.revertState();
  }

  revertState() {
    setTimeout(() => {
        this.setState({
        clicked: false
      })
    }, 4000);
  }

  render() {
    const itemNum = this.state.itemNum;
    const clicked = this.state.clicked;
    let cart;
    if (clicked) {
      cart = <Cart
              storeLogo={this.state.storeLogo}
              subtotal={this.state.subtotal}
              storeMinimumFreeShipping={this.state.storeMinimumFreeShipping}
            />
    }
    return (
      <div className="main">
        <div>
          {cart}
        </div>
        <div className="deliveryRow">
          <i className="material-icons md-12">local_shipping</i>
          <div>Free delivery by {this.state.deliveryDate}</div>
        </div>
        <div className="containerLocation">
          <i className="material-icons md-12">place</i>
          <div className="ship">Ship to <span className="blue">95121</span></div>
        </div>
        <div className="containerLogo">
          <img className="logo" src={this.state.storeLogo} />
          <div className="sellerInfoContainer">
            <div className="soldBy">Sold by {this.state.storeName}</div>
            <div className="blue">Free returns</div>
          </div>
        </div>
        <div className="saving">Deal: 20% off your first order</div>
        <div className="effectivePrice">${(this.state.price).toFixed(2)}</div>
        <div className="add-to-cart">
          {itemNum ? (
          <DynamicAddToCart
            onMinusSignClicked={this.onMinusSignClicked}
            onPlusSignClicked={this.onPlusSignClicked}
            itemNum={this.state.itemNum}
          />
        ) : (
          <StaticAddToCart onStaticAddToCartClicked={this.onStaticAddToCartClicked}/>
        )}
        </div>
        <div className="terms">20% off your first order, up to $20 with code <b>SUMMERFUN</b>.</div>
        <div className="terms">Expires {this.state.deliveryDate}. Exclusions apply. See Terms.</div>
        <div className="protectedContainer">
          <i className="material-icons md-12">verified_user</i>
          <div className="howitworks">Expressel works with retailers to protect your order. <span className="blue">Learn more</span></div>
        </div>
      </div>
    );
  }
}

export default App;
