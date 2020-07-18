import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getOrderBook } from '../../security-token.reducer';

export interface OrderBookProps extends StateProps, DispatchProps {
  id: number;
}

const OrderBook = (props: OrderBookProps) => {
  const { orderBook } = props;

  useEffect(() => {
    if (props.id) props.getOrderBook(props.id);
  }, [props.id]);

  return (
    <div className="mt-2 px-2 pb-2 bg-white" style={{ height: '55%', overflowY: 'scroll' }}>
      <small>Order book</small>
      <div className="w-100">
        <div className=" d-flex justify-content-between text-secondary " style={{ fontSize: '12px' }}>
          <span>Total</span>
          <span>Size</span>
          <span>Prices</span>
          <span>Size</span>
          <span>Total</span>
        </div>
        <div className="d-flex">
          <div className="w-50">
            {orderBook &&
              orderBook.buyOrders.map(order => (
                <div key={order.id} className="d-flex justify-content-between w-100 mr-1">
                  <span className="text-success">{order.totalAmount}</span>
                  <span className="text-success" style={{ marginLeft: '21px' }}>
                    {order.volume}
                  </span>
                  <span className="text-success">{order.price}</span>
                </div>
              ))}
          </div>
          <div className="w-50">
            {orderBook &&
              orderBook.sellOrders.map(order => (
                <div key={order.id} className="d-flex justify-content-between w-100 ml-1">
                  <span className="text-danger">{order.price}</span>
                  <span className="text-danger pl-4" style={{ marginRight: '21px' }}>
                    {order.volume}
                  </span>
                  <span className="text-danger pr-2">{order.totalAmount}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ securityToken }: IRootState) => ({
  orderBook: securityToken.orderBook
});

const mapDispatchToProps = {
  getOrderBook
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrderBook);
