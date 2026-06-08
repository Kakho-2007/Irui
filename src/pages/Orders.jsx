import React from "react";
import dayjs from "dayjs";
import "./Orders.css";
import { useEffect } from "react";

export default function Orders() {
  const orders = JSON.parse(localStorage.getItem("irui_orders") || "[]");

  useEffect(() => {
    document.title = "Irui Store | Order History";
  }, []);

  return (
    <main className="orders-container">
      <h1 className="page-title">Transaction History</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          No historical transactions found on this engine profile.
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-block">
            <div className="order-block-header">
              <div>
                <span className="label">Order Placed:</span>
                <span className="value">
                  {dayjs(order.orderTime).format("MMMM D, YYYY")}
                </span>
              </div>
              <div>
                <span className="label">Total Value:</span>
                <span className="value">
                  ${(order.totalCostCents / 100).toFixed(2)}
                </span>
              </div>
              <div className="order-id-box">
                <span className="label">ID:</span>
                <span className="value-id">{order.id}</span>
              </div>
            </div>
            <div className="order-block-body">
              {order.products.map((item) => (
                <div key={item.productId} className="order-item-row">
                  <div className="item-meta">
                    <h5>Quantity Count: {item.quantity}</h5>
                    <p>Estimated Delivery Window ID: {item.deliveryOptionId}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  );
}
