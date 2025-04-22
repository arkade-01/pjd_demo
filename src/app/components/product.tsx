"use client"

import React, { useState } from 'react';
import { createPaymentOrder, formatWAT } from "../api/pay";

interface Flavor {
  name: string;
  color: string;
  price: number;
}

interface ProductData {
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  condition: string;
  description: string;
  inStock: number;
  flavors: Flavor[];
  sizes: string[];
  delivery: {
    free: string;
    express: string;
    expressTime: string;
  };
}

interface PaymentResponse {
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

// Adding a style block to force light mode
const lightModeStyles = `
  :root {
    --background: #ffffff !important;
    --foreground: #171717 !important;
  }
  
  body {
    background-color: #ffffff !important;
    color: #171717 !important;
  }
`;

const ProductPage: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string>('Regular');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('Citrus Punch');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const product: ProductData = {
    name: "Item 7 Meal with Drink",
    price: 1.00,
    rating: 4.8,
    reviewCount: 237,
    condition: "New",
    description: "Tasty and delicious meal with a refreshing drink. Perfect for any occasion.",
    inStock: 15,
    flavors: [
      { name: 'Berry Blast', color: '#9b2d74', price: 1.00 },
      { name: 'Tropical Sunrise', color: '#ff9939', price: 1.00 },
      { name: 'Green Apple', color: '#7fba44', price: 1.00 },
      { name: 'Blue Raspberry', color: '#0078d7', price: 1.00 },
      { name: 'Citrus Punch', color: '#fbca03', price: 1.00 }
    ],
    sizes: ['Small', 'Regular', 'Large'],
    delivery: {
      free: "Saturday, April 19",
      express: "Friday, April 18",
      expressTime: "21 hrs 45 mins"
    }
  };

  const selectedFlavorObj = product.flavors.find(f => f.name === selectedFlavor) || product.flavors[0];

  const renderStars = (rating: number): React.ReactNode[] => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400 text-sm">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400 text-sm">★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300 text-sm">★</span>);
    }

    return stars;
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await createPaymentOrder({
        productName: product.name,
        price: selectedFlavorObj.price.toFixed(2),
        flavor: selectedFlavor,
        size: selectedSize
      });

      setPaymentInfo(response);
      setShowPaymentModal(true);
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="main-h-screen bg-white text-black">
      {/* Inject light mode styles */}
      <style dangerouslySetInnerHTML={{ __html: lightModeStyles }} />

      {/* Navigation Bar */}
      <div className="bg-gray-900 text-white p-3 mb-6  justify-between items-center">
        <div className="text-xl font-bold">MyStore</div>
        <div className="flex items-center space-x-6">
          <div>Search</div>
          <div>Account</div>
          <div>Cart (0)</div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 bg-white">
        Home &gt; Food &gt; Nigerian Delicacies
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg p-4 flex items-center justify-center h-96 border border-gray-200">
            <div
              style={{ backgroundColor: selectedFlavorObj.color, width: '80%', height: '80%' }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="./pj.jpg"
                  alt={`${product.name} - ${selectedFlavor}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex mt-4 gap-2 justify-center">
            {[1, 2, 3, 4].map(id => (
              <div key={id} className="w-16 h-16 bg-white rounded cursor-pointer border border-gray-200" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 bg-white text-black">
          <h1 className="text-2xl font-bold mb-2">{product.name} - {selectedFlavor}</h1>

          <div className="flex items-center mb-3">
            <div className="flex mr-2">
              {renderStars(product.rating)}
            </div>
            <div className="text-gray-500 text-sm">{product.rating} ({product.reviewCount} ratings)</div>
          </div>

          <div className="border-t border-b py-3 my-4">
            <div className="text-2xl font-semibold text-red-600">${selectedFlavorObj.price.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">Condition: {product.condition}</div>
            <div className="mt-2 text-sm text-gray-700">{product.description}</div>
          </div>

          <div className="my-5">
            <div className="font-medium mb-2">Flavor: {selectedFlavor}</div>
            <div className="flex gap-3 mb-4">
              {product.flavors.map(flavor => (
                <button
                  key={flavor.name}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${selectedFlavor === flavor.name ? 'border-blue-500' : 'border-gray-300'}`}
                  style={{ backgroundColor: flavor.color }}
                  onClick={() => setSelectedFlavor(flavor.name)}
                  aria-label={flavor.name}
                >
                  {selectedFlavor === flavor.name && <div className="w-2 h-2 rounded-full bg-white" />}
                </button>
              ))}
            </div>

            <div className="font-medium mb-2">Size: {selectedSize}</div>
            <div className="flex gap-2 mb-6">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`px-4 py-2 rounded ${selectedSize === size
                    ? 'border-2 border-blue-600 bg-blue-50 font-medium'
                    : 'border border-gray-300'}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-2">
              <div className="text-sm">FREE delivery {product.delivery.free}</div>
              <div className="text-sm mt-1">Or fastest delivery {product.delivery.express} (Order within <span className="text-green-600 font-medium">{product.delivery.expressTime}</span>)</div>
            </div>

            <div className="text-green-500 font-medium mt-3">
              In Stock: {product.inStock} available
            </div>
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded text-black font-medium">
            Add to Cart
          </button>

          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-medium mt-3"
            onClick={handlePayment}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span>Payment Details</span>
              {isLoading && (
                <div className="ml-2 w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              )}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </h2>

            {isLoading ? (
              <div className="py-8 text-center">
                <p className="mb-2">Initializing payment...</p>
                <div className="w-8 h-8 mx-auto rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"></div>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md text-red-800 mb-4">
                    {errorMessage}
                  </div>
                )}

                {paymentInfo && paymentInfo.status === "success" ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 p-3 rounded-md text-green-800 mb-4">
                      {paymentInfo.message}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-1 items-center">
                        <span className="text-gray-500 col-span-1">Amount:</span>
                        <span className="font-medium col-span-2">{paymentInfo.data.amount} {paymentInfo.data.token}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 items-center">
                        <span className="text-gray-500 col-span-1">Token:</span>
                        <span className="font-medium col-span-2">{paymentInfo.data.token}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 items-center">
                        <span className="text-gray-500 col-span-1">Network:</span>
                        <span className="font-medium col-span-2">{paymentInfo.data.network}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 items-start">
                        <span className="text-gray-500 col-span-1">Receive Address:</span>
                        <span className="font-medium col-span-2 break-all">{paymentInfo.data.receiveAddress}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 items-center">
                        <span className="text-gray-500 col-span-1">Valid Until:</span>
                        <span className="font-medium col-span-2">{formatWAT(paymentInfo.data.validUntil)}</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-4">
                        Please complete your payment before the expiration time. Once payment is confirmed, your order will be processed.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-medium"
                          onClick={() => {
                            // Copy address to clipboard
                            if (paymentInfo.data.receiveAddress) {
                              navigator.clipboard.writeText(paymentInfo.data.receiveAddress)
                                .then(() => alert('Address copied to clipboard!'))
                                .catch(err => console.error('Failed to copy: ', err));
                            }
                          }}
                        >
                          Copy Address
                        </button>

                        <button
                          className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded font-medium"
                          onClick={() => setShowPaymentModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                ) : paymentInfo ? (
                  <div className="text-center py-6">
                    <div className="text-red-500 mb-4">
                      Payment request failed: {paymentInfo.message || "Unknown error"}
                    </div>
                    <button
                      className="w-full border border-gray-300 hover:bg-gray-100 py-2 rounded font-medium"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-red-500 mb-4">
                      Failed to initialize payment. Please try again.
                    </div>
                    <button
                      className="w-full border border-gray-300 hover:bg-gray-100 py-2 rounded font-medium"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;