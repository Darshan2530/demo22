// ===== DOM Elements =====
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const successModal = document.getElementById('successModal');
const submitAnother = document.getElementById('submitAnother');

// ===== Focus Effects on Cards =====
document.querySelectorAll('.form-card').forEach(card => {
    const inputs = card.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            card.classList.add('focused');
            card.classList.remove('error');
        });
        input.addEventListener('blur', () => {
            card.classList.remove('focused');
        });
    });
});

// ===== Auto-resize Textarea =====
const textarea = document.getElementById('comments');
if (textarea) {
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// ===== "Other" Radio Option Logic =====
function setupOtherOption(groupName, otherInputId) {
    const radios = document.querySelectorAll(`input[name="${groupName}"]`);
    const otherInput = document.getElementById(otherInputId);

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'other') {
                otherInput.disabled = false;
                otherInput.focus();
            } else {
                otherInput.disabled = true;
                otherInput.value = '';
            }
        });
    });
}

setupOtherOption('event', 'eventOther');
setupOtherOption('source', 'sourceOther');

// ===== Validation =====
function validateField(fieldId, errorId, validationFn) {
    const field = document.getElementById(fieldId);
    const card = field.closest('.form-card');
    const isValid = validationFn(field);

    if (!isValid) {
        card.classList.add('error');
        card.classList.remove('focused');
    } else {
        card.classList.remove('error');
    }

    return isValid;
}

function validateRadioGroup(name, errorId) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const isChecked = Array.from(radios).some(r => r.checked);
    const card = radios[0].closest('.form-card');

    if (!isChecked) {
        card.classList.add('error');
        card.classList.remove('focused');
    } else {
        card.classList.remove('error');
    }

    return isChecked;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== Form Submission =====
form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;

    // Validate Full Name
    if (!validateField('fullName', 'fullNameError', field => field.value.trim() !== '')) {
        isValid = false;
    }

    // Validate Email
    if (!validateField('email', 'emailError', field => isValidEmail(field.value))) {
        isValid = false;
    }

    // Validate Event Selection
    if (!validateRadioGroup('event', 'eventError')) {
        isValid = false;
    }

    // Validate Experience
    if (!validateField('experience', 'experienceError', field => field.value !== '')) {
        isValid = false;
    }

    // Validate Date
    if (!validateField('preferredDate', 'dateError', field => field.value !== '')) {
        isValid = false;
    }

    // Validate Source
    if (!validateRadioGroup('source', 'sourceError')) {
        isValid = false;
    }

    if (isValid) {
        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            event: getRadioValue('event'),
            experience: document.getElementById('experience').value,
            interests: getCheckboxValues('interests'),
            preferredDate: document.getElementById('preferredDate').value,
            comments: document.getElementById('comments').value.trim(),
            source: getRadioValue('source')
        };

        console.log('Form submitted:', formData);

        // Show success modal
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate button
        submitBtn.textContent = 'Submitted!';
        submitBtn.style.background = '#4caf50';
        setTimeout(() => {
            submitBtn.textContent = 'Submit';
            submitBtn.style.background = '';
        }, 2000);
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.form-card.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// ===== Helper Functions =====
function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    if (!checked) return '';
    if (checked.value === 'other') {
        const otherInput = checked.closest('.other-option').querySelector('.other-input');
        return otherInput ? otherInput.value : 'other';
    }
    return checked.value;
}

function getCheckboxValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(cb => cb.value);
}

// ===== Clear Form =====
clearBtn.addEventListener('click', function () {
    if (confirm('This will remove your answers from all questions, and cannot be undone.')) {
        form.reset();

        // Clear all error states
        document.querySelectorAll('.form-card').forEach(card => {
            card.classList.remove('error', 'focused');
        });

        // Disable "Other" inputs
        document.querySelectorAll('.other-input').forEach(input => {
            input.disabled = true;
            input.value = '';
        });

        // Reset textarea height
        if (textarea) {
            textarea.style.height = 'auto';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ===== Submit Another Response =====
submitAnother.addEventListener('click', function (e) {
    e.preventDefault();

    // Hide modal
    successModal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form
    form.reset();
    document.querySelectorAll('.form-card').forEach(card => {
        card.classList.remove('error', 'focused');
    });
    document.querySelectorAll('.other-input').forEach(input => {
        input.disabled = true;
        input.value = '';
    });
    if (textarea) {
        textarea.style.height = 'auto';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Real-time Validation (clear errors on input) =====
['fullName', 'email', 'experience', 'preferredDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            el.closest('.form-card').classList.remove('error');
        });
    }
});

['event', 'source'].forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
        radio.addEventListener('change', () => {
            radio.closest('.form-card').classList.remove('error');
        });
    });
});
