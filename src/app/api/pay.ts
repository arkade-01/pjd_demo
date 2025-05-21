// api/paymentService.ts
import axios from "axios";
import test from "node:test";

// Define types
export interface PaymentResponse {
  message: string;
  status: string;
  data: {
    id: string;
    amount: string;
    token: string;
    network: string;
    receiveAddress: string;
    validUntil: string;
    senderFee: string;
    transactionFee: string;
    reference: string;
  }
}

export interface PaymentRequest {
  userId: string;
  amount: string;
  network: string;
  token: string;
  memo: string;
  reference: string;
  // returnAddress: string;
}

// Create payment API client
const paymentAPI = axios.create({
  baseURL: "http://localhost:3000/v1/api/payments",
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '4u1u4j5djzpbwl1lfpd7ly48pb29ni'
  }
});

/**
 * Create a payment order
 * @param productInfo Information about the product being purchased
 * @returns Payment response from API
 */
export const createPaymentOrder = async (productInfo: {
  productName: string;
  price: string;
  flavor?: string;
  size?: string;
}): Promise<PaymentResponse> => {
  try {
    // Format product details for memo
    const memo = productInfo.flavor && productInfo.size
      ? `Payment for ${productInfo.productName} - ${productInfo.flavor} (${productInfo.size})`
      : `Payment for ${productInfo.productName}`;

    // Create unique reference
    const cleanProductName = productInfo.productName.replace(/\s+/g, '');
    const cleanFlavor = productInfo.flavor ? productInfo.flavor.replace(/\s+/g, '') : '';
    const reference = `${cleanProductName}-${cleanFlavor}-${Date.now()}`;

    // Prepare request body
    const requestBody: PaymentRequest = {
      userId: "680a495518220e7e4e07114c",
      amount: productInfo.price,
      token: "USDC",
      network: "base",
      memo: memo,
      reference: reference,
    };

    console.log("Payment Request:", JSON.stringify(requestBody, null, 2));

    // Make API call
    const response = await paymentAPI.post("/createOrder", requestBody);

    console.log("Payment Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment API Error:", error);

    // Enhance error message with API details if available
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      const responseData = error.response.data;

      console.error("API Error Details:", {
        status: statusCode,
        data: responseData
      });

      // Add validation errors to the error object if available
      if (responseData?.data) {
        const apiError = new Error(`Validation error: ${JSON.stringify(responseData.data)}`);
        apiError.name = "ValidationError";
        throw apiError;
      }

      // Throw error with API message
      const apiError = new Error(responseData?.message || error.message);
      apiError.name = "APIError";
      throw apiError;
    }

    // Throw generic error
    throw error;
  }
};

// Format date to West African Time (WAT)
export const formatWAT = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-NG', {
      timeZone: 'Africa/Lagos',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WAT';
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

// export const testPaymentAPI = async () => {
//   try {
//     const response = await createPaymentOrder({
//       productName: "Test Product",
//       price: "1.00", // Make sure to use a string with 2 decimal places
//       flavor: "Vanilla",
//       size: "Large"
//     });
//     console.log("Payment test successful!");
//     console.log(JSON.stringify(response, null, 2));
//     return response;
//   } catch (error) {
//     console.error("Payment test failed:", error);
//     throw error;
//   }
// };


