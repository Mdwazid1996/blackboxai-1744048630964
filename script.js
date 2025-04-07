// Common utility functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const menu = document.querySelector('.mobile-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        });
    }

    // Update dashboard counters
    if (document.querySelector('main.index')) {
        updateDashboardCounters();
    }
});

    // Update dashboard statistics
    function updateDashboardCounters() {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
        const today = new Date().toISOString().split('T')[0];
        
        document.querySelector('#employee-count').textContent = employees.length;
        
        // Calculate today's attendance
        const presentCount = attendance.filter(record => 
            record.date === today && record.status === 'Present'
        ).length;
        document.querySelector('#leave-count').textContent = presentCount;
        
        // Calculate payroll count (employees with salary data)
        const payrollCount = employees.filter(emp => emp.salary).length;
        document.querySelector('#payroll-count').textContent = payrollCount;
    }
