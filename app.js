// Replace with your merchant info
const merchantInfo = {
    merchantName: "Mangify",  // Updated to Mangify
    merchantId: "BCR2DN6TQXJ3ABCD",  // Google Pay Merchant ID (replace with yours)
};

// Set up Google Pay API client
const googlePayClient = new google.payments.api.PaymentsClient({
    environment: 'TEST'  // Change to 'PRODUCTION' for live payments
});

// Function to handle when "Buy Now" is clicked
function buyArt(itemName, price) {
    // Define Google Pay payment request dynamically
    const paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: merchantInfo,
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: price.toFixed(2),  // Dynamically set the price
            currencyCode: 'INR',  // Indian Rupees (INR)
        },
        allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    'gateway': 'example',  // Replace with your gateway
                    'gatewayMerchantId': 'exampleMerchantId',
                },
            },
        }],
    };

    // Trigger the Google Pay button and handle payment
    googlePayClient.loadPaymentData(paymentRequest)
        .then(function(paymentData) {
            processPayment(paymentData);
        })
        .catch(function(error) {
            console.error("Error loading payment data: ", error);
        });
}

// Process payment
function processPayment(paymentData) {
    console.log('Payment successful: ', paymentData);
    alert('Payment Successful!');
}

// Initialize the Google Pay button when the page loads
window.onload = function () {
    googlePayClient.isReadyToPay({
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
        }],
    }).then(function(response) {
        if (response.result) {
            const button = googlePayClient.createButton({
                onClick: onGooglePayButtonClicked,
            });
            document.getElementById('google-pay-button').appendChild(button);
        }
    }).catch(function(error) {
        console.error("Google Pay error: ", error);
    });
}

// Handle Google Pay button click
function onGooglePayButtonClicked() {
    const paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: merchantInfo,
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: '100.00',  // Set the price based on the selected item
            currencyCode: 'INR', // Indian Rupees (INR)
        },
        allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    'gateway': 'example',  // Replace with your gateway
                    'gatewayMerchantId': 'exampleMerchantId',
                },
            },
        }],
    };

    googlePayClient.loadPaymentData(paymentRequest)
        .then(function(paymentData) {
            processPayment(paymentData);
        })
        .catch(function(error) {
            console.error("Error loading payment data: ", error);
        });
}

// Process payment
function processPayment(paymentData) {
    console.log('Payment successful:', paymentData);
    alert('Payment Successful!');
}

// Function to redirect to the upload page with the respective price
function redirectToUploadPage(price) {
    // Store the price in localStorage or sessionStorage to access on the upload page
    localStorage.setItem("artPrice", price);
    // Redirect to the upload page
    window.location.href = 'upload.html';
}

// Function to handle file upload on the upload page
function handleUpload() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please upload an image or PDF file.");
        return false;  // Prevent form submission if no file is selected
    }

    // For now, just log the file details to the console
    const uploadedFile = fileInput.files[0];
    console.log("File Uploaded:", uploadedFile.name);

    // Enable the "Proceed to Buy" button after file upload
    document.getElementById('buyNowBtn').disabled = false;

    return false;  // Prevent form submission to stay on the same page
}

// Function to handle the "Proceed to Buy" button
function buyArt() {
    // Retrieve the stored price from localStorage
    const price = localStorage.getItem("artPrice");

    if (price) {
        // Call the buyArt function with the price from localStorage
        alert(`Proceeding to payment for ₹${price}`);

        // Trigger Google Pay (or redirect to payment page)
        const itemName = 'Art Item';  // Example, adjust based on actual item
        buyArt(itemName, price);  // Use the Google Pay function with the price
    } else {
        alert("Price information not available.");
    }
}
