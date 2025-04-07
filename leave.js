// Leave Management Module
document.addEventListener('DOMContentLoaded', function() {
    // Initialize leave data in localStorage if not exists
    if (!localStorage.getItem('leaveRequests')) {
        localStorage.setItem('leaveRequests', JSON.stringify([]));
    }
    if (!localStorage.getItem('leaveBalances')) {
        localStorage.setItem('leaveBalances', JSON.stringify({
            sick: 10,
            vacation: 15,
            personal: 5
        }));
    }

    // DOM elements
    const leaveForm = document.getElementById('leave-form');
    const leaveRequestsTable = document.getElementById('leave-requests');
    const sickBalance = document.getElementById('sick-balance');
    const vacationBalance = document.getElementById('vacation-balance');
    const personalBalance = document.getElementById('personal-balance');

    // Load leave balances
    const balances = JSON.parse(localStorage.getItem('leaveBalances'));
    sickBalance.textContent = `${balances.sick} days`;
    vacationBalance.textContent = `${balances.vacation} days`;
    personalBalance.textContent = `${balances.personal} days`;

    // Handle leave form submission
    if (leaveForm) {
        leaveForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const leaveType = document.getElementById('leave-type').value;
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const reason = document.getElementById('reason').value;

            // Calculate number of days
            const days = calculateLeaveDays(startDate, endDate);
            
            // Check if enough leave balance
            if (balances[leaveType.toLowerCase()] < days) {
                showToast(`Not enough ${leaveType} balance!`, 'error');
                return;
            }

            const newRequest = {
                id: Date.now(),
                type: leaveType,
                startDate,
                endDate,
                days,
                reason,
                status: 'Pending',
                submittedAt: new Date().toISOString()
            };

            const requests = JSON.parse(localStorage.getItem('leaveRequests'));
            requests.push(newRequest);
            localStorage.setItem('leaveRequests', JSON.stringify(requests));

            // Update balance
            balances[leaveType.toLowerCase()] -= days;
            localStorage.setItem('leaveBalances', JSON.stringify(balances));
            updateLeaveBalances();

            showToast('Leave request submitted successfully!');
            leaveForm.reset();
            updateLeaveRequestsTable();
        });
    }

    // Update leave requests table
    function updateLeaveRequestsTable() {
        leaveRequestsTable.innerHTML = '';
        const requests = JSON.parse(localStorage.getItem('leaveRequests'));
        
        requests.slice().reverse().forEach(request => {
            const row = document.createElement('tr');
            row.className = 'border-t';
            row.innerHTML = `
                <td class="py-2 px-4">${request.type}</td>
                <td class="py-2 px-4">${formatDate(request.startDate)} - ${formatDate(request.endDate)}</td>
                <td class="py-2 px-4">${request.days}</td>
                <td class="py-2 px-4">
                    <span class="px-2 py-1 rounded ${
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        request.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                    }">
                        ${request.status}
                    </span>
                </td>
                <td class="py-2 px-4">
                    ${request.status === 'Pending' ? 
                        `<button class="text-red-500 hover:text-red-700" onclick="cancelLeaveRequest(${request.id})">
                            <i class="fas fa-times mr-1"></i>Cancel
                        </button>` : 
                        '-'
                    }
                </td>
            `;
            leaveRequestsTable.appendChild(row);
        });
    }

    // Helper functions
    function calculateLeaveDays(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const timeDiff = endDate - startDate;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Inclusive of both dates
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function updateLeaveBalances() {
        const balances = JSON.parse(localStorage.getItem('leaveBalances'));
        sickBalance.textContent = `${balances.sick} days`;
        vacationBalance.textContent = `${balances.vacation} days`;
        personalBalance.textContent = `${balances.personal} days`;
    }

    // Initialize the view
    updateLeaveRequestsTable();
});

// Cancel leave request
function cancelLeaveRequest(id) {
    if (confirm('Are you sure you want to cancel this leave request?')) {
        let requests = JSON.parse(localStorage.getItem('leaveRequests'));
        const requestIndex = requests.findIndex(r => r.id === id);
        
        if (requestIndex !== -1 && requests[requestIndex].status === 'Pending') {
            // Restore leave balance
            const balances = JSON.parse(localStorage.getItem('leaveBalances'));
            balances[requests[requestIndex].type.toLowerCase()] += requests[requestIndex].days;
            localStorage.setItem('leaveBalances', JSON.stringify(balances));
            
            // Remove request
            requests = requests.filter(r => r.id !== id);
            localStorage.setItem('leaveRequests', JSON.stringify(requests));
            
            showToast('Leave request cancelled');
            window.location.reload();
        }
    }
}

// Helper function to show toast notifications
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