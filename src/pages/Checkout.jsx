import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { placeOrder } from "../utils/backend";
import "./Checkout.css";

const DELIVERY_OPTIONS = [
  { id: "1", days: 7, priceCents: 0, label: "FREE Shipping" },
  { id: "2", days: 3, priceCents: 499, label: "Standard Shipping" },
  { id: "3", days: 1, priceCents: 999, label: "Overnight Shipping" },
];

export default function Checkout({
  cart,
  removeFromCart,
  updateDeliveryOption,
  clearCart,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Irui Store | Cart (${cart.length})`;
  }, [cart.length]);

  const [promoInput, setPromoInput] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const itemsPriceCents = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  const discountAmountCents = Math.round(itemsPriceCents * discountRate);
  const discountedItemsPriceCents = itemsPriceCents - discountAmountCents;

  const shippingPriceCents = cart.reduce((sum, item) => {
    const option =
      DELIVERY_OPTIONS.find((o) => o.id === item.deliveryOptionId) ||
      DELIVERY_OPTIONS[0];
    return sum + option.priceCents * item.quantity;
  }, 0);

  const totalBeforeTaxCents = discountedItemsPriceCents + shippingPriceCents;
  const estimatedTaxCents = Math.round(totalBeforeTaxCents * 0.1);
  const orderTotalCents = totalBeforeTaxCents + estimatedTaxCents;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (promoInput.trim().toLowerCase() === "kakhwardi") {
      setDiscountRate(0.1);
      setPromoSuccess("Code 'kakhwardi' applied! Saved 10% on items.");
    } else if (promoInput.trim() === "") {
      setPromoError("Please enter a code.");
    } else {
      setPromoError("Invalid promotional code.");
      setDiscountRate(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      const completedOrder = await placeOrder(cart);

      completedOrder.totalCostCents = orderTotalCents;

      const historicOrders = JSON.parse(
        localStorage.getItem("irui_orders") || "[]",
      );
      localStorage.setItem(
        "irui_orders",
        JSON.stringify([completedOrder, ...historicOrders]),
      );

      clearCart();
      navigate("/orders");
    } catch (err) {
      alert("Order submission failure.");
    }
  };

  return (
    <main className="checkout-container">
      <div className="checkout-main">
        <h2>Review Summary Layout ({cart.length} unique items)</h2>
        {cart.length === 0 ? (
          <div className="empty-notification">
            Your basket configuration is currently empty.
          </div>
        ) : (
          cart.map((item) => {
            const selectedOption =
              DELIVERY_OPTIONS.find((o) => o.id === item.deliveryOptionId) ||
              DELIVERY_OPTIONS[0];
            const activeDeliveryDate = dayjs()
              .add(selectedOption.days, "day")
              .format("dddd, MMMM D");

            return (
              <div key={item.id} className="checkout-item">
                <div className="delivery-header">
                  Delivery Target: {activeDeliveryDate}
                </div>
                <div className="checkout-item-body">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="checkout-img"
                  />
                  <div className="checkout-details">
                    <h4>{item.name}</h4>
                    <p className="item-cost">
                      ${(item.priceCents / 100).toFixed(2)}
                    </p>
                    <p className="item-qty">Quantity: {item.quantity}</p>
                    <button
                      className="delete-action"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove Element
                    </button>
                  </div>
                  <div className="delivery-selector-pane">
                    <h5>Select Logistics Tier:</h5>
                    {DELIVERY_OPTIONS.map((option) => (
                      <label key={option.id} className="delivery-radio-label">
                        <input
                          type="radio"
                          name={`delivery-${item.id}`}
                          checked={item.deliveryOptionId === option.id}
                          onChange={() =>
                            updateDeliveryOption(item.id, option.id)
                          }
                        />
                        <span>
                          {dayjs().add(option.days, "day").format("ddd, MMM D")}{" "}
                          —{" "}
                          {option.priceCents === 0
                            ? "FREE"
                            : `$${(option.priceCents / 100).toFixed(2)}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="order-summary-card">
        <h3>Invoice Configuration</h3>
        <div className="summary-row">
          <span>Items base total:</span>
          <span>${(itemsPriceCents / 100).toFixed(2)}</span>
        </div>

        {discountRate > 0 && (
          <div className="summary-row promo-discount-row">
            <span>Promo Discount (10%):</span>
            <span>-${(discountAmountCents / 100).toFixed(2)}</span>
          </div>
        )}

        <div className="summary-row">
          <span>Logistics fees:</span>
          <span>${(shippingPriceCents / 100).toFixed(2)}</span>
        </div>
        <hr className="summary-divider" />
        <div className="summary-row">
          <span>Total Net:</span>
          <span>${(totalBeforeTaxCents / 100).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Estimated Duty (10%):</span>
          <span>${(estimatedTaxCents / 100).toFixed(2)}</span>
        </div>
        <hr className="summary-divider" />
        <div className="summary-row total-row">
          <span>Gross Payable:</span>
          <span>${(orderTotalCents / 100).toFixed(2)}</span>
        </div>

        <div className="promo-section-wrapper">
          <form onSubmit={handleApplyPromo} className="promo-input-container">
            <input
              type="text"
              placeholder="Gift card or promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              disabled={discountRate > 0}
              className="promo-inline-input"
            />
            <button
              type="submit"
              className="promo-apply-btn"
              disabled={discountRate > 0}
            >
              Apply
            </button>
          </form>
          {promoError && (
            <p className="promo-status-msg error-msg">{promoError}</p>
          )}
          {promoSuccess && (
            <p className="promo-status-msg success-msg">{promoSuccess}</p>
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={cart.length === 0}
          className="place-order-btn"
        >
          Execute Settlement
        </button>
      </div>
    </main>
  );
}
