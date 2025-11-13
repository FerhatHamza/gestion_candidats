document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inscriptionForm');
    const message = document.getElementById('message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset previous messages and error styles
        message.style.display = 'none';
        message.classList.remove('success', 'error');
        form.querySelectorAll('input, select').forEach(field => {
            field.style.border = '1px solid #ccc'; // Reset border
        });

        // Basic Check for all required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            // Check for radio buttons
            if (field.type === 'radio' && form.querySelectorAll('input[name="' + field.name + '"]:checked').length === 0) {
                isFormValid = false;
            } 
            // Check for text, date, select, and file inputs
            else if (field.type !== 'radio' && !field.value.trim()) {
                isFormValid = false;
                field.style.border = '2px solid #a94442'; // Highlight error field
            }
        });

        // Check declaration checkbox separately
        const declarationChecked = document.getElementById('declaration').checked;
        if (!declarationChecked) {
             isFormValid = false;
        }

        if (isFormValid) {
            // --- SIMULATED SUCCESSFUL SUBMISSION ---
            
            // In a real application, you would use fetch() to send data to your server/database.
            // Example structure:
            /*
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Handle success from server
            })
            .catch(error => {
                // Handle network/server error
            });
            */

            message.textContent = '✅ تم استلام طلبك بنجاح! سيتم مراجعة المعلومات والوثائق.';
            message.classList.add('success');
            message.style.display = 'block';
            
            // Optional: Disable the form fields after successful submission
            // form.querySelectorAll('input, select, button').forEach(el => el.disabled = true); 

        } else {
            message.textContent = '❌ الرجاء ملء جميع الحقول الإلزامية وتأكيد التعهد.';
            message.classList.add('error');
            message.style.display = 'block';
        }
    });
});
