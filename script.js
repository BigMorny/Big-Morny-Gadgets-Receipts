document.addEventListener('DOMContentLoaded', () => {
    const receiptNumberInput = document.getElementById('receiptNumber');
    const receiptDateInput = document.getElementById('receiptDate');
    const generateReceiptBtn = document.getElementById('generateReceiptBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // Customer Information
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');

    // Transaction Type Selection
    const transactionTypeRadios = document.querySelectorAll('input[name="transactionType"]');

    // Conditional Device Details Wrapper
    const conditionalDeviceDetailsWrapper = document.getElementById('conditionalDeviceDetailsWrapper');

    // New Device Information Section (within the wrapper)
    const newDeviceInformationSection = document.getElementById('newDeviceInformationSection');
    const deviceTypeSelect = document.getElementById('deviceType');
    const phoneSpecificFields = document.getElementById('phoneSpecificFields');
    const otherDeviceTypeField = document.getElementById('otherDeviceTypeField');
    const phoneBrandSelect = document.getElementById('phoneBrand');
    const phoneModelInput = document.getElementById('phoneModel');
    const phoneStorageInput = document.getElementById('phoneStorage');
    const phoneColorInput = document.getElementById('phoneColor');
    const specificDeviceTypeInput = document.getElementById('specificDeviceType');
    const deviceConditionSelect = document.getElementById('deviceCondition');
    const deviceIMEIInput = document.getElementById('deviceIMEI');
    const deviceAccessoriesTextarea = document.getElementById('deviceAccessories');
    const devicePriceInput = document.getElementById('devicePrice');
    const accessoriesPriceInput = document.getElementById('accessoriesPrice');

    // Trade-in Elements (within the wrapper)
    const tradeInDetailsForSwapDiv = document.getElementById('tradeInDetailsForSwap');
    const oldPhoneNameInput = document.getElementById('oldPhoneName');
    const oldPhoneStorageInput = document.getElementById('oldPhoneStorage');

    // Payment Details (now only method and total)
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const mobileMoneyFields = document.getElementById('mobileMoneyFields');
    const cardPaymentFields = document.getElementById('cardPaymentFields');
    const bankTransferFields = document.getElementById('bankTransferFields');
    const momoNetworkSelect = document.getElementById('momoNetwork');
    const cardTypeSelect = document.getElementById('cardType');
    const cardLast4Input = document.getElementById('cardLast4');
    const cardAuthCodeInput = document.getElementById('cardAuthCode');
    const bankNameSelect = document.getElementById('bankName');
    const bankTransferRefInput = document.getElementById('bankTransferRef');
    const totalAmountDisplay = document.getElementById('totalAmountDisplay');

    // Placeholder base64 logo (replace with your actual logo's base64 string)
    const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAF76z3rAAAAAElFTkSuQmCC'; // Replace this with your actual base64 logo

    // --- Initial Setup and Event Listeners ---

    // Set current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    receiptDateInput.value = today.toLocaleDateString('en-GB', options);

    // Generate a simple receipt number (e.g., R-YYYYMMDD-HHMMSS)
    const generateReceiptNumber = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        receiptNumberInput.value = `R-${year}${month}${day}-${hours}${minutes}${seconds}`;
    };
    generateReceiptNumber(); // Generate on page load

    // Device Type Change Listener (only relevant when newDeviceInformationSection is active)
    deviceTypeSelect.addEventListener('change', () => {
        phoneSpecificFields.classList.remove('active');
        otherDeviceTypeField.classList.remove('active');

        // Reset specific fields when type changes
        phoneBrandSelect.value = '';
        phoneModelInput.value = '';
        phoneStorageInput.value = '';
        phoneColorInput.value = '';
        specificDeviceTypeInput.value = '';

        if (deviceTypeSelect.value === 'phone') {
            phoneSpecificFields.classList.add('active');
        } else if (deviceTypeSelect.value === 'other') {
            otherDeviceTypeField.classList.add('active');
        }
    });

    // Payment Method Change Listener
    paymentMethodSelect.addEventListener('change', () => {
        // Hide all payment-method-specific fields first
        mobileMoneyFields.classList.remove('active');
        cardPaymentFields.classList.remove('active');
        bankTransferFields.classList.remove('active');

        // Reset all specific payment fields
        momoNetworkSelect.value = '';
        cardTypeSelect.value = '';
        cardLast4Input.value = '';
        cardAuthCodeInput.value = '';
        bankNameSelect.value = '';
        bankTransferRefInput.value = '';

        // Show the relevant fields based on selection
        switch (paymentMethodSelect.value) {
            case 'mobileMoney':
                mobileMoneyFields.classList.add('active');
                break;
            case 'cardPayment':
                cardPaymentFields.classList.add('active');
                break;
            case 'bankTransfer':
                bankTransferFields.classList.add('active');
                break;
        }
    });

    // Transaction Type Listener - Controls main device info visibility
    transactionTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            // Hide all conditional device sections initially
            conditionalDeviceDetailsWrapper.classList.remove('active');
            newDeviceInformationSection.classList.remove('active');
            tradeInDetailsForSwapDiv.classList.remove('active');

            // Reset all fields within these sections
            resetNewDeviceFields();
            resetOldDeviceFields();

            if (document.getElementById('directBuy').checked) {
                conditionalDeviceDetailsWrapper.classList.add('active');
                newDeviceInformationSection.classList.add('active');
            } else if (document.getElementById('swapTradeIn').checked) {
                conditionalDeviceDetailsWrapper.classList.add('active');
                newDeviceInformationSection.classList.add('active');
                tradeInDetailsForSwapDiv.classList.add('active');
            }
            calculateTotal(); // Recalculate total
        });
    });

    // Amount calculation listeners
    devicePriceInput.addEventListener('input', calculateTotal);
    accessoriesPriceInput.addEventListener('input', calculateTotal);

    // --- Helper Functions for Resetting Fields ---
    function resetNewDeviceFields() {
        deviceTypeSelect.value = '';
        phoneSpecificFields.classList.remove('active');
        otherDeviceTypeField.classList.remove('active');
        phoneBrandSelect.value = '';
        phoneModelInput.value = '';
        phoneStorageInput.value = '';
        phoneColorInput.value = '';
        specificDeviceTypeInput.value = '';
        deviceConditionSelect.value = 'new';
        deviceIMEIInput.value = '';
        deviceAccessoriesTextarea.value = '';
        devicePriceInput.value = '0.00';
        accessoriesPriceInput.value = '0.00';
    }

    function resetOldDeviceFields() {
        oldPhoneNameInput.value = '';
        oldPhoneStorageInput.value = '';
    }

    // --- Core Functions ---

    function calculateTotal() {
        // Total is always new device price + accessories price, as trade-in value is not a deduction on the form
        const devicePrice = parseFloat(devicePriceInput.value) || 0;
        const accessoriesPrice = parseFloat(accessoriesPriceInput.value) || 0;
        const total = devicePrice + accessoriesPrice;
        totalAmountDisplay.textContent = total.toFixed(2); // Display with 2 decimal places
    }

    function generateReceipt() {
        // --- Collect all data ---
        const receiptData = {
            receiptNumber: receiptNumberInput.value,
            receiptDate: receiptDateInput.value,
            customerName: customerNameInput.value,
            customerPhone: customerPhoneInput.value,
            
            transactionType: document.querySelector('input[name="transactionType"]:checked')?.value || '', // Safely get value

            // Device Information (only if wrapper is active)
            deviceType: conditionalDeviceDetailsWrapper.classList.contains('active') ? deviceTypeSelect.value : '',
            phoneBrand: conditionalDeviceDetailsWrapper.classList.contains('active') ? phoneBrandSelect.value : '',
            phoneModel: conditionalDeviceDetailsWrapper.classList.contains('active') ? phoneModelInput.value : '',
            phoneStorage: conditionalDeviceDetailsWrapper.classList.contains('active') ? phoneStorageInput.value : '',
            phoneColor: conditionalDeviceDetailsWrapper.classList.contains('active') ? phoneColorInput.value : '',
            specificDeviceType: conditionalDeviceDetailsWrapper.classList.contains('active') ? specificDeviceTypeInput.value : '',
            deviceCondition: conditionalDeviceDetailsWrapper.classList.contains('active') ? deviceConditionSelect.value : '',
            deviceIMEI: conditionalDeviceDetailsWrapper.classList.contains('active') ? deviceIMEIInput.value : '',
            deviceAccessories: conditionalDeviceDetailsWrapper.classList.contains('active') ? deviceAccessoriesTextarea.value : '',
            devicePrice: conditionalDeviceDetailsWrapper.classList.contains('active') ? (parseFloat(devicePriceInput.value) || 0) : 0,
            accessoriesPrice: conditionalDeviceDetailsWrapper.classList.contains('active') ? (parseFloat(accessoriesPriceInput.value) || 0) : 0,
            
            // Old Device Information (only if swap is active)
            oldPhoneName: document.getElementById('swapTradeIn').checked ? oldPhoneNameInput.value : '',
            oldPhoneStorage: document.getElementById('swapTradeIn').checked ? oldPhoneStorageInput.value : '',
            
            paymentMethod: paymentMethodSelect.value,
            momoNetwork: momoNetworkSelect.value,
            cardType: cardTypeSelect.value,
            cardLast4: cardLast4Input.value,
            cardAuthCode: cardAuthCodeInput.value,
            bankName: bankNameSelect.value,
            bankTransferRef: bankTransferRefInput.value,
            
            totalAmountPaid: parseFloat(totalAmountDisplay.textContent) || 0
        };

        // --- Basic Validation for selected transaction type ---
        if (!receiptData.transactionType) {
            alert("Please select a Transaction Type (Direct Buy or Swap).");
            return;
        }

        if (receiptData.transactionType === 'directBuy' || receiptData.transactionType === 'swapTradeIn') {
            if (!receiptData.deviceType || (receiptData.deviceType === 'other' && !receiptData.specificDeviceType) || !receiptData.deviceIMEI || receiptData.devicePrice === 0) {
                 alert("Please fill in all required New Device Information fields (Device Type, IMEI/Serial, New Device Price).");
                 return;
            }
             if (receiptData.deviceType === 'phone' && (!receiptData.phoneBrand || !receiptData.phoneModel || !receiptData.phoneStorage)) {
                 alert("Please fill in all required Phone specific fields (Brand, Model, Storage).");
                 return;
            }
        }
        
        if (receiptData.transactionType === 'swapTradeIn') {
            if (!receiptData.oldPhoneName || !receiptData.oldPhoneStorage) {
                alert("Please fill in all Old Device Trade-in Details (Phone Name, Storage).");
                return;
            }
        }

        if (!receiptData.paymentMethod || receiptData.totalAmountPaid === 0) {
            alert("Please select a Payment Method and ensure Total Amount Paid is greater than 0.");
            return;
        }

        // Determine the label for Total Amount Paid on receipt
        const totalAmountLabel = receiptData.transactionType === 'swapTradeIn' ? 'Amount Added to Old Device:' : 'Total Amount Paid:';

        // --- Construct Receipt HTML ---
        let receiptHtml = `
            <div class="receipt-print-content">
                <header class="receipt-header">
                    <div class="logo-section">
                        <img src="images/Big_Morny_Gadgets.png" alt="Big Morny Gadgets Logo" class="your-actual-logo">
                    </div>
                    <h2>Official Receipt</h2>
                </header>

                <section class="receipt-details-section">
                    <div class="input-group">
                        <label>Receipt Number:</label>
                        <span>${receiptData.receiptNumber}</span>
                    </div>
                    <div class="input-group">
                        <label>Date:</label>
                        <span>${receiptData.receiptDate}</span>
                    </div>
                </section>

                <div class="main-receipt-content-columns">
                    <section class="customer-info-section form-section">
                        <h3>Customer Information</h3>
                        <div class="input-group">
                            <label>Customer Name:</label>
                            <span>${receiptData.customerName}</span>
                        </div>
                        <div class="input-group">
                            <label>Phone Number:</label>
                            <span>${receiptData.customerPhone}</span>
                        </div>
                    </section>

                    <section class="transaction-type-print-section form-section">
                        <h3>Transaction Type</h3>
                        <div class="input-group">
                            <label>Type:</label>
                            <span>${receiptData.transactionType === 'directBuy' ? 'Direct Buy' : 'Swap (Trade-in)'}</span>
                        </div>
                    </section>
                </div>

                ${receiptData.transactionType === 'directBuy' || receiptData.transactionType === 'swapTradeIn' ? `
                <div class="main-receipt-content-columns">
                    <section class="device-info-section form-section">
                        <h3>New Device Information</h3>
                        <div class="input-group">
                            <label>Device Type:</label>
                            <span>${receiptData.deviceType === 'other' ? receiptData.specificDeviceType : capitalizeFirstLetter(receiptData.deviceType)}</span>
                        </div>
                        ${receiptData.deviceType === 'phone' ? `
                        <div class="input-group">
                            <label>Brand:</label>
                            <span>${capitalizeFirstLetter(receiptData.phoneBrand)}</span>
                        </div>
                        <div class="input-group">
                            <label>Model:</label>
                            <span>${receiptData.phoneModel}</span>
                        </div>
                        <div class="input-group">
                            <label>Storage:</label>
                            <span>${receiptData.phoneStorage}</span>
                        </div>
                        <div class="input-group">
                            <label>Color:</label>
                            <span>${receiptData.phoneColor}</span>
                        </div>
                        ` : ''}
                        <div class="input-group">
                            <label>Condition:</label>
                            <span>${capitalizeFirstLetter(receiptData.deviceCondition)}</span>
                        </div>
                        <div class="input-group">
                            <label>IMEI/Serial:</label>
                            <span>${receiptData.deviceIMEI}</span>
                        </div>
                        <div class="input-group">
                            <label>Accessories:</label>
                            <span>${receiptData.deviceAccessories || 'N/A'}</span>
                        </div>
                        <hr style="margin: 8px 0; border: 0; border-top: 1px dashed #eee;">
                        <div class="input-group">
                            <label>New Device Price:</label>
                            <span>GHS ${receiptData.devicePrice.toFixed(2)}</span>
                        </div>
                        <div class="input-group">
                            <label>Accessories Price:</label>
                            <span>GHS ${receiptData.accessoriesPrice.toFixed(2)}</span>
                        </div>
                    </section>
                    ${receiptData.transactionType === 'swapTradeIn' ? `
                    <section class="trade-in-details-print-section form-section">
                        <h3>Old Device Trade-in Details</h3>
                        <div class="input-group">
                            <label>Phone Name:</label>
                            <span>${receiptData.oldPhoneName || 'N/A'}</span>
                        </div>
                        <div class="input-group">
                            <label>Storage:</label>
                            <span>${receiptData.oldPhoneStorage || 'N/A'}</span>
                        </div>
                    </section>
                    ` : ''}
                </div> ` : ''}

                <section class="payment-details-section form-section">
                    <h3>Payment Details</h3>
                    <div class="input-group">
                        <label>Method:</label>
                        <span>${capitalizeFirstLetter(receiptData.paymentMethod)}</span>
                    </div>
                    ${receiptData.paymentMethod === 'mobileMoney' ? `
                    <div class="input-group">
                        <label>Network:</label>
                        <span>${receiptData.momoNetwork.toUpperCase()}</span>
                    </div>
                    ` : ''}
                    ${receiptData.paymentMethod === 'cardPayment' ? `
                    <div class="input-group">
                        <label>Card Type:</label>
                        <span>${capitalizeFirstLetter(receiptData.cardType)}</span>
                    </div>
                    <div class="input-group">
                        <label>Last 4 Digits:</label>
                        <span>${receiptData.cardLast4}</span>
                    </div>
                    <div class="input-group">
                        <label>Auth Code:</label>
                        <span>${receiptData.cardAuthCode}</span>
                    </div>
                    ` : ''}
                    ${receiptData.paymentMethod === 'bankTransfer' ? `
                    <div class="input-group">
                        <label>Bank Name:</label>
                        <span>${capitalizeFirstLetter(receiptData.bankName)}</span>
                    </div>
                    <div class="input-group">
                        <label>Reference:</label>
                        <span>${receiptData.bankTransferRef}</span>
                    </div>
                    ` : ''}

                    <hr style="margin: 8px 0; border: 0; border-top: 1px dashed #eee;">

                    <div class="input-group total-amount-display">
                        <label>${totalAmountLabel}</label>
                        <span class="currency-display">GHS ${receiptData.totalAmountPaid.toFixed(2)}</span>
                    </div>
                </section>

                <section class="acknowledgement-section form-section">
                    <h3>Acknowledgment</h3>
                    <div class="acknowledgement-text-only">
                        <p>Sold by: <strong>Big Morny Gadgets</strong></p>
                    </div>
                </section>
            </div>
        `;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Official Receipt</title>');
        printWindow.document.write('<link rel="stylesheet" href="style.css">'); // Link original CSS for print styles
        printWindow.document.write('</head><body>');
        printWindow.document.write(receiptHtml);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Wait for images to load before printing
        const images = printWindow.document.querySelectorAll('img');
        let loadedImages = 0;

        if (images.length === 0) {
            printWindow.focus();
            printWindow.print();
            // printWindow.close(); // Optionally close after printing
        } else {
            images.forEach(img => {
                img.onload = () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        printWindow.focus();
                        printWindow.print();
                        // printWindow.close(); // Optionally close after printing
                    }
                };
                img.onerror = () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        printWindow.focus();
                        printWindow.print();
                        // printWindow.close(); // Optionally close after printing
                    }
                };
            });
        }
    }

    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function resetForm() {
        receiptNumberInput.value = '';
        generateReceiptNumber(); // Regenerate new receipt number
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        receiptDateInput.value = today.toLocaleDateString('en-GB', options);

        customerNameInput.value = '';
        customerPhoneInput.value = '';

        // Reset and hide device sections and uncheck radios
        transactionTypeRadios.forEach(radio => radio.checked = false);
        conditionalDeviceDetailsWrapper.classList.remove('active');
        newDeviceInformationSection.classList.remove('active');
        tradeInDetailsForSwapDiv.classList.remove('active');
        
        resetNewDeviceFields(); // Reset all fields inside new device info
        resetOldDeviceFields(); // Reset all fields inside old device info

        paymentMethodSelect.value = '';
        mobileMoneyFields.classList.remove('active');
        cardPaymentFields.classList.remove('active');
        bankTransferFields.classList.remove('active');
        momoNetworkSelect.value = '';
        cardTypeSelect.value = '';
        cardLast4Input.value = '';
        cardAuthCodeInput.value = '';
        bankNameSelect.value = '';
        bankTransferRefInput.value = '';

        calculateTotal(); // Recalculate to show 0.00
    }

    // --- Button Event Listeners ---
    generateReceiptBtn.addEventListener('click', generateReceipt);
    resetFormBtn.addEventListener('click', resetForm);

    // Initial state: hide conditional device sections on load
    conditionalDeviceDetailsWrapper.classList.remove('active');
    calculateTotal(); // Ensure total is 0.00 initially
});