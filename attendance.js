// Attendance Management Module
document.addEventListener('DOMContentLoaded', function() {
    // Initialize attendance data in localStorage if not exists
    if (!localStorage.getItem('attendance')) {
        localStorage.setItem('attendance', JSON.stringify([]));
    }

    // DOM elements
    const checkInBtn = document.getElementById('check-in-btn');
    const checkOutBtn = document.getElementById('check-out-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const timeDisplay = document.getElementById('time-display');
    const attendanceRecords = document.getElementById('attendance-records');
    const calendar = document.getElementById('attendance-calendar');

    // Check current attendance status
    const today = new Date().toISOString().split('T')[0];
    const attendanceData = JSON.parse(localStorage.getItem('attendance'));
    const todayRecord = attendanceData.find(record => record.date === today);

    // Update UI based on current status
    if (todayRecord) {
        if (todayRecord.checkOut) {
            statusIndicator.textContent = 'Checked Out';
            statusIndicator.className = 'text-2xl font-bold text-gray-500';
            checkInBtn.disabled = true;
            checkOutBtn.disabled = true;
            timeDisplay.textContent = `In: ${todayRecord.checkIn} | Out: ${todayRecord.checkOut}`;
        } else {
            statusIndicator.textContent = 'Checked In';
            statusIndicator.className = 'text-2xl font-bold text-green-500';
            checkInBtn.disabled = true;
            checkOutBtn.disabled = false;
            timeDisplay.textContent = `In: ${todayRecord.checkIn}`;
        }
    }

    // Check In handler
    checkInBtn.addEventListener('click', function() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        const newRecord = {
            date: today,
            checkIn: timeString,
            checkOut: null,
            status: 'Present'
        };

        attendanceData.push(newRecord);
        localStorage.setItem('attendance', JSON.stringify(attendanceData));

        statusIndicator.textContent = 'Checked In';
        statusIndicator.className = 'text-2xl font-bold text-green-500';
        checkInBtn.disabled = true;
        checkOutBtn.disabled = false;
        timeDisplay.textContent = `In: ${timeString}`;
        
        showToast('Checked in successfully!');
        updateAttendanceRecords();
    });

    // Check Out handler
    checkOutBtn.addEventListener('click', function() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        const recordIndex = attendanceData.findIndex(record => 
            record.date === today && !record.checkOut
        );

        if (recordIndex !== -1) {
            attendanceData[recordIndex].checkOut = timeString;
            localStorage.setItem('attendance', JSON.stringify(attendanceData));

            statusIndicator.textContent = 'Checked Out';
            statusIndicator.className = 'text-2xl font-bold text-gray-500';
            checkOutBtn.disabled = true;
            timeDisplay.textContent = `In: ${attendanceData[recordIndex].checkIn} | Out: ${timeString}`;
            
            showToast('Checked out successfully!');
            updateAttendanceRecords();
        }
    });

    // Update attendance records table
    function updateAttendanceRecords() {
        attendanceRecords.innerHTML = '';
        const records = JSON.parse(localStorage.getItem('attendance'));
        
        records.slice().reverse().forEach(record => {
            const row = document.createElement('tr');
            row.className = 'border-t';
            row.innerHTML = `
                <td class="py-2 px-4">${record.date}</td>
                <td class="py-2 px-4">${record.checkIn || '-'}</td>
                <td class="py-2 px-4">${record.checkOut || '-'}</td>
                <td class="py-2 px-4">
                    <span class="px-2 py-1 rounded ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' : 
                        record.status === 'Absent' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                    }">
                        ${record.status}
                    </span>
                </td>
            `;
            attendanceRecords.appendChild(row);
        });
    }

    // Initialize calendar
    function renderCalendar() {
        calendar.innerHTML = '';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Add day headers
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'text-center font-semibold py-1';
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });

        // Add calendar days
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'h-8';
            calendar.appendChild(emptyCell);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayCell = document.createElement('div');
            dayCell.className = 'text-center py-1 border rounded cursor-pointer hover:bg-gray-100';
            dayCell.textContent = day;
            
            // Check attendance status for this day
            const record = attendanceData.find(r => r.date === dateStr);
            if (record) {
                dayCell.className += record.status === 'Present' ? ' bg-green-50' : ' bg-red-50';
            }
            
            calendar.appendChild(dayCell);
        }
    }

    // Initialize the view
    updateAttendanceRecords();
    renderCalendar();
});

// Helper function to show toast notifications
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded shadow-lg';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}