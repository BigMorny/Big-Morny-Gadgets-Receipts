document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const receiptNumberEl = document.getElementById('receiptNumber');
    const receiptDateEl = document.getElementById('receiptDate');

    const customerNameEl = document.getElementById('customerName');

    const deviceTypeEl = document.getElementById('deviceType');
    const phoneSpecificFields = document.getElementById('phoneSpecificFields');
    const otherDeviceTypeField = document.getElementById('otherDeviceTypeField');
    const phoneBrandEl = document.getElementById('phoneBrand');
    const phoneModelEl = document.getElementById('phoneModel');
    const phoneStorageEl = document.getElementById('phoneStorage');
    const phoneColorEl = document.getElementById('phoneColor');
    const specificDeviceTypeEl = document.getElementById('specificDeviceType');
    const deviceIMEIEl = document.getElementById('deviceIMEI');

    const paymentMethodEl = document.getElementById('paymentMethod');
    const mobileMoneyFields = document.getElementById('mobileMoneyFields');
    const cardPaymentFields = document.getElementById('cardPaymentFields');
    const bankTransferFields = document.getElementById('bankTransferFields');

    // New amount elements
    const devicePriceEl = document.getElementById('devicePrice');
    const accessoriesPriceEl = document.getElementById('accessoriesPrice');
    const totalAmountDisplayEl = document.getElementById('totalAmountDisplay'); // Renamed from amountDisplayEl

    const generateReceiptBtn = document.getElementById('generateReceiptBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // --- Initial Setup ---

    // Generate Receipt Number (simple example: BMG-YYYYMMDD-HHMMSS)
    const generateReceiptNumber = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `BMG-${year}${month}${day}-${hours}${minutes}${seconds}`;
    };

    // Set current date (editable)
    const setCurrentDate = () => {
        const now = new Date();
        receiptDateEl.value = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    receiptNumberEl.value = generateReceiptNumber();
    setCurrentDate();

    // --- Device Type Logic ---
    const toggleDeviceFields = () => {
        const selectedDeviceType = deviceTypeEl.value;

        // Hide all conditional device fields first by removing 'active' class
        phoneSpecificFields.classList.remove('active');
        otherDeviceTypeField.classList.remove('active');

        // Reset values of hidden conditional fields to prevent incorrect data capture
        phoneBrandEl.value = '';
        phoneModelEl.value = '';
        phoneStorageEl.value = '';
        phoneColorEl.value = '';
        specificDeviceTypeEl.value = '';

        // Show relevant fields by adding 'active' class
        if (selectedDeviceType === 'phone') {
            phoneSpecificFields.classList.add('active');
        } else if (selectedDeviceType === 'other') {
            otherDeviceTypeField.classList.add('active');
        }
    };

    deviceTypeEl.addEventListener('change', toggleDeviceFields);
    toggleDeviceFields(); // Call on load to set initial state

    // --- Payment Method Logic ---
    const togglePaymentFields = () => {
        const selectedMethod = paymentMethodEl.value;

        mobileMoneyFields.classList.remove('active');
        cardPaymentFields.classList.remove('active');
        bankTransferFields.classList.remove('active');

        if (selectedMethod === 'mobileMoney') {
            mobileMoneyFields.classList.add('active');
        } else if (selectedMethod === 'cardPayment') {
            cardPaymentFields.classList.add('active');
        } else if (selectedMethod === 'bankTransfer') {
            bankTransferFields.classList.add('active');
        }
    };

    paymentMethodEl.addEventListener('change', togglePaymentFields);
    togglePaymentFields(); // Call on load to set initial state

    // --- Amount Calculation Logic ---
    const updateTotalAmount = () => {
        const devicePrice = parseFloat(devicePriceEl.value) || 0;
        const accessoriesPrice = parseFloat(accessoriesPriceEl.value) || 0;
        const totalAmount = devicePrice + accessoriesPrice;
        totalAmountDisplayEl.textContent = totalAmount.toFixed(2);
    };

    devicePriceEl.addEventListener('input', updateTotalAmount);
    accessoriesPriceEl.addEventListener('input', updateTotalAmount);
    updateTotalAmount(); // Initial display on load

    // --- Generate and Print Receipt ---
    generateReceiptBtn.addEventListener('click', () => {
        // Basic validation
        if (!customerNameEl.value.trim()) {
            alert('Please enter Customer Name.');
            customerNameEl.focus();
            return;
        }
        if (!receiptDateEl.value.trim()) {
            alert('Please enter the Date.');
            receiptDateEl.focus();
            return;
        }

        // Validate device price (must be greater than 0)
        const currentDevicePrice = parseFloat(devicePriceEl.value) || 0;
        if (currentDevicePrice <= 0) {
            alert('Please enter a valid Device Price (must be greater than 0).');
            devicePriceEl.focus();
            return;
        }

        // Total amount validation
        const totalAmount = parseFloat(totalAmountDisplayEl.textContent) || 0;
        if (totalAmount <= 0) {
            alert('The Total Amount Paid must be greater than 0.');
            // This case should ideally be covered by devicePrice validation,
            // but good as a fallback if accessories price somehow makes it negative (though not possible with min="0").
            return;
        }


        // Device information validation based on type
        const selectedDeviceType = deviceTypeEl.value;
        if (!selectedDeviceType) {
            alert('Please select a Device Type.');
            deviceTypeEl.focus();
            return;
        }

        if (selectedDeviceType === 'phone') {
            if (!phoneBrandEl.value || !phoneModelEl.value.trim() || !phoneStorageEl.value.trim() || !phoneColorEl.value.trim()) {
                alert('Please fill in Phone Brand, Model, Storage, and Color.');
                if (!phoneBrandEl.value) phoneBrandEl.focus();
                else if (!phoneModelEl.value.trim()) phoneModelEl.focus();
                else if (!phoneStorageEl.value.trim()) phoneStorageEl.focus();
                else phoneColorEl.focus();
                return;
            }
        } else if (selectedDeviceType === 'other') {
            if (!specificDeviceTypeEl.value.trim()) {
                alert('Please specify the "Other" Device Type.');
                specificDeviceTypeEl.focus();
                return;
            }
        }
        // IMEI is now required for ALL device types
        if (!deviceIMEIEl.value.trim()) {
            alert('Please enter the IMEI / Serial Number.');
            deviceIMEIEl.focus();
            return;
        }

        if (!paymentMethodEl.value) {
            alert('Please select a Payment Method.');
            paymentMethodEl.focus();
            return;
        }

        // Trigger browser print dialog
        window.print();
    });

    // --- Reset Form ---
    resetFormBtn.addEventListener('click', () => {
        // Reset all input fields to their default or empty state
        document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], input[type="number"], textarea').forEach(input => {
            if (input.id !== 'receiptNumber') {
                input.value = '';
            }
        });
        document.querySelectorAll('select').forEach(select => {
            select.value = select.options[0].value; // Set to first option
        });

        // Reset specific default values for new price fields
        devicePriceEl.value = '0.00';
        accessoriesPriceEl.value = '0.00';

        // Re-generate receipt number and reset date/time
        receiptNumberEl.value = generateReceiptNumber();
        setCurrentDate();

        // Reset device specific fields and their visibility
        toggleDeviceFields();
        // Reset payment field visibility
        togglePaymentFields();
        // Update the total amount display span
        updateTotalAmount();
    });
});