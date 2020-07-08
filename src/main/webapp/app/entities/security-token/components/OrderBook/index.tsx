import React from 'react';

const OrderBook = () => {
  return (
    <div className="mt-2 px-2 pb-2 bg-white ">
      <small>Order book</small>
      <table className="w-100">
        <thead style={{ fontSize: '12px' }}>
          <tr className="border-0 text-secondary ">
            <th>Total</th>
            <th>Size</th>
            <th className="text-center">Prices</th>
            <th>Size</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-success">12</td>
            <td className="text-success">12</td>
            <td className="text-center">
              <span className="mr-1 text-success">12.3 </span>
              <span className="ml-1 text-danger"> 334.5</span>
            </td>
            <td className="text-danger">12</td>
            <td className="text-danger">12</td>
          </tr>
          <tr>
            <td className="text-success">12</td>
            <td className="text-success">12</td>
            <td className="text-center">
              <span className="mr-1 text-success">12.3 </span>
              <span className="ml-1 text-danger"> 334.5</span>
            </td>
            <td className="text-danger">12</td>
            <td className="text-danger">12</td>
          </tr>
          <tr>
            <td className="text-success">12</td>
            <td className="text-success">12</td>
            <td className="text-center">
              <span className="mr-1 text-success">12.3 </span>
              <span className="ml-1 text-danger"> 334.5</span>
            </td>
            <td className="text-danger">12</td>
            <td className="text-danger">12</td>
          </tr>
          <tr>
            <td className="text-success">12</td>
            <td className="text-success">12</td>
            <td className="text-center">
              <span className="mr-1 text-success">12.3 </span>
              <span className="ml-1 text-danger"> 334.5</span>
            </td>
            <td className="text-danger">12</td>
            <td className="text-danger">12</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderBook;
