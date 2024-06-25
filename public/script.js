document.addEventListener('DOMContentLoaded', function () {
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const rsvpButton = document.getElementById('rsvpButton');
    const walimaDetails = document.getElementById('walimaDetails');
    const nikkahForm = document.getElementById('nikkahForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const errorMessage = document.getElementById('errorMessage');
    const walimaDateElement = document.getElementById('walimaDate');
    const daysLeftElement = document.getElementById('daysLeft');
    let currentStep = 0;

    // Calculate days left to RSVP
    const walimaDate = new Date('2024-08-10');
    const today = new Date();
    const timeDiff = walimaDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    daysLeftElement.textContent = daysLeft;

    rsvpButton.addEventListener('click', () => {
        walimaDetails.style.display = 'none';
        nikkahForm.style.display = 'block';
    });

    nextBtns.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (validateFormStep(currentStep)) {
                hideErrorMessage();
                formSteps[currentStep].classList.remove('form-step-active');
                formSteps[currentStep].classList.add('form-step-previous');
                currentStep = (currentStep + 1) % formSteps.length;
                formSteps[currentStep].classList.remove('form-step-previous');
                formSteps[currentStep].classList.add('form-step-active');
            } else {
                showErrorMessage();
            }
        });
    });

    document.getElementById('nikkahForm').addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateFormStep(currentStep)) {
            hideErrorMessage();
            nikkahForm.style.display = 'none';
            thankYouMessage.style.display = 'block';
            const formData = new FormData(nikkahForm);
            console.log('Submitting form data:', Object.fromEntries(formData.entries())); // Log form data
            submitFormData(formData);
        } else {
            showErrorMessage();
        }
    });

    function validateFormStep(step) {
        const formStep = formSteps[step];
        let isValid = true;
        const inputs = formStep.querySelectorAll('input');

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                console.log('Invalid input:', input.name, input.value); // Log invalid input
                isValid = false;
            }
        });

        if (step === 1) { // Check radio buttons in the second step
            const radioYes = document.getElementById('attending-yes');
            const radioNo = document.getElementById('attending-no');
            if (!radioYes.checked && !radioNo.checked) {
                console.log('No radio button selected'); // Log radio button issue
                isValid = false;
            }
        }

        return isValid;
    }

    function showErrorMessage() {
        errorMessage.classList.remove('error-hidden');
        errorMessage.classList.add('error-message');
    }

    function hideErrorMessage() {
        errorMessage.classList.remove('error-message');
        errorMessage.classList.add('error-hidden');
    }

    function submitFormData(formData) {
        fetch('https://nikkah-ishtiaqabdullah11-gmailcoms-projects.vercel.app/api/submit', {  // Ensure this URL points to your Vercel deployment
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                nikkahForm.style.display = 'none';
                thankYouMessage.style.display = 'block';
            } else {
                showErrorMessage();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage();
        });
    }
});
