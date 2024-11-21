// Trigger the file input when the "Choose File" button is clicked
function triggerFileInput() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click(); // This will open the file dialog for the user
}

// Handle file upload and enable the "Proceed to Buy" button
function handleUpload() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please upload an image or PDF file.");
        return;  // Do nothing if no file is selected
    }

    const uploadedFile = fileInput.files[0];
    console.log("File Uploaded:", uploadedFile.name);
    
    // Display file name in the UI
    document.getElementById('fileStatus').innerText = `File Selected: ${uploadedFile.name}`;
    
    // Enable the "Proceed to Buy" button after file upload
    document.getElementById('buyNowBtn').disabled = false;
}

// Function to handle the "Proceed to Buy" button and initiate Google Pay
function proceedToBuy() {
    // Check if a file is uploaded
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please upload a file before proceeding.");
        return;  // Prevent proceeding without a file
    }

    // Proceed to Google Pay after file upload
    initiateGooglePay();
}

// Function to initiate the Google Pay payment process
function initiateGooglePay() {
    const googlePayClient = new google.payments.api.PaymentsClient({
        environment: 'TEST'  // Change to 'PRODUCTION' when you are live
    });

    const merchantInfo = {
        merchantName: "Mangify",  // Your merchant name
        merchantId: "BCR2DN6TQXJ3ABCD"  // Your Google Pay Merchant ID (replace with your own)
    };

    const paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: merchantInfo,
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: '100.00',  // Set this to the actual price
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
                    'gatewayMerchantId': 'exampleMerchantId',  // Replace with your merchant ID
                },
            },
        }],
    };

    // Load and show the Google Pay payment button
    googlePayClient.loadPaymentData(paymentRequest)
        .then(function(paymentData) {
            // Handle the payment data and process the payment
            processPayment(paymentData);
        })
        .catch(function(error) {
            console.error("Error loading payment data: ", error);
            alert("There was an error processing the payment.");
        });
}

// Function to handle successful payment (backend processing should be done here)
function processPayment(paymentData) {
    console.log("Payment successful:", paymentData);
    alert("Payment successful! Thank you for your purchase.");
}
