/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { useSearchParams } from "next/navigation"

export const PaymentClient = () => {
    const amount = 99; 
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(""); 
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true)
    const [tokenValid, setTokenValid] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [checkingEmail, setCheckingEmail] = useState(true)
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token || !tokenValid) {
            setCheckingEmail(false)
            return
        }

        const fetchEmail = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/get-email`
                )
                setUserEmail(res.data.email ?? null)
            } catch (error) {
                console.error("Error while fetching user email:", error)
                setUserEmail(null)
            } finally {
                setCheckingEmail(false)
            }
        }

        fetchEmail()
    }, [token, tokenValid])

    useEffect(() => {
        if (!token) {
            setCheckingToken(false)
            return
        }

        const verify = async () => {
            try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/verify-payment-token`,
                { token }
            )

            const data = await res.data
            setTokenValid(data.valid)
            } catch(error) {
                console.error("Error while verifying token: ", error)
                setTokenValid(false)
            } finally {
                setCheckingToken(false)
            }
        }

        verify()
    }, [token])

    const handlePayment = async () => {
        if (!razorpayLoaded) {
            setPaymentStatus("Razorpay script not loaded. Please try again.");
            return;
        }

        setIsProcessing(true);
        setPaymentStatus("");

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/create-order`, 
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = res.data;

            if (!data.orderId) {
                throw new Error("Order ID not received from server.");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: "INR",
                name: "Zap",
                description: "Zap Pro - One-time lifetime access",
                order_id: data.orderId,
                handler: async function (response: any) {
                    console.log("Payment successful", response);
                    
                    try {
                        const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-payment`, 
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        
                        if (verifyRes.data) {
                            setPaymentStatus(`Payment Successful! You are now a Premium user.`);
                        }
                        await new Promise(r => setTimeout(r, 2000))
                        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/chat?paid=true`;
                    } catch (error) {
                        console.error("Payment verification failed", error);
                        setPaymentStatus("Payment completed but verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "Zap User",
                    email:  userEmail ? userEmail : undefined,
                    contact: "",
                },
                notes: {
                    address: "Zap Technologies, India",
                },
                theme: {
                    color: "#6D28D9",
                },
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                console.log(response.error.description);
                setPaymentStatus(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();

        } catch (error) {
            console.error("Error while handling payment: ", error);
            setPaymentStatus("An error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (checkingToken || checkingEmail) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-purple-500" />
            </div>
        )
    }

    if (!token || !tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm text-center">
                    Invalid or expired payment link.
                </p>
            </div>
        )
    }


    return (
        <>
           
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
            />

            <div className="min-h-screen bg-neutral-100 dark:bg-neutral-800/10 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
                <div className="w-full max-w-md p-5 sm:p-8 space-y-6 sm:space-y-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-neutral-200/50 dark:shadow-neutral-900 rounded-lg shadow-lg">
                    
                    <div>
                        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-200">
                            Complete Your Payment
                        </h2>
                        <p className="mt-2 text-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                           Securely pay with Razorpay
                        </p>
                    </div>

                    <div className="border-t border-b border-neutral-200 dark:border-neutral-700 py-4 sm:py-6">
                        <div className="flex justify-between items-center">
                            <p className="text-base sm:text-lg font-medium text-neutral-800 dark:text-neutral-300">Zap Pro</p>
                            <p className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-300">₹{amount.toFixed(2)}</p>
                        </div>
                         <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">A one-time purchase for our premium service.</p>
                    </div>

                    <div>
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing || !razorpayLoaded}
                            className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-base sm:text-lg font-medium text-white bg-purple-500/70 hover:bg-purple-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                    <span className="text-sm sm:text-base">Processing...</span>
                                </>
                            ) : (
                                `Pay ₹${amount.toFixed(2)} Now`
                            )}
                        </button>
                    </div>

                    {paymentStatus && (
                        <div className={`mt-3 sm:mt-4 text-center p-2.5 sm:p-3 rounded-md text-xs sm:text-sm ${
                            paymentStatus.includes('Successful') 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        }`}>
                            {paymentStatus}
                        </div>
                    )}
                    
                    <div className="text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <p>🔒 All transactions are secure and encrypted.</p>
                    </div>

                </div>
            </div>
        </>
    );
};