import api from './api';

export const paymentService = {
  // Create Razorpay order
  createRazorpayOrder: async (amount, orderData) => {
    const response = await api.post('/payment/create-order', {
      amount,
      orderData
    });
    return response;
  },

  // Verify Razorpay payment and create order
  verifyPayment: async (paymentResponse, orderData) => {
    const response = await api.post('/payment/verify-payment', {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
      orderData
    });
    return response;
  },
};

export default paymentService;
