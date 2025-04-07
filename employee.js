// Employee Management Module
document.addEventListener('DOMContentLoaded', function() {
    // Initialize employee data in localStorage if not exists
    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify([]));
    }

    // Handle form submission for adding new employees
    const employeeForm = document.getElementById('employee-form');
    if (employeeForm) {
        employeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newEmployee = {
                id: Date.now(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                department: document.getElementById('department').value,
                salary: parseFloat(document.getElementById('salary').value)
            };

            const employees = JSON.parse(localStorage.getItem('employees'));
            employees.push(newEmployee);
            localStorage.setItem('employees', JSON.stringify(employees));
            
            alert('Employee added successfully!');
            window.location.href = 'employees.html';
        });
    }

    // Load and display employees in the table
    const employeeTableBody = document.getElementById('employee-table-body');
    if (employeeTableBody) {
        const employees = JSON.parse(localStorage.getItem('employees'));
        
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.className = 'border-t';
            row.innerHTML = `
                <td class="py-2 px-4">${employee.name}</td>
                <td class="py-2 px-4">${employee.email}</td>
                <td class="py-2 px-4">${employee.department}</td>
                <td class="py-2 px-4">
                    <button class="text-blue-500 hover:text-blue-700 mr-2" onclick="editEmployee(${employee.id})">Edit</button>
                    <button class="text-red-500 hover:text-red-700" onclick="deleteEmployee(${employee.id})">Delete</button>
                </td>
            `;
            employeeTableBody.appendChild(row);
        });
    }
});

// Edit employee function
function editEmployee(id) {
    const employees = JSON.parse(localStorage.getItem('employees'));
    const employee = employees.find(e => e.id === id);
    
    if (employee) {
        document.getElementById('name').value = employee.name;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.department;
        document.getElementById('salary').value = employee.salary;
        
        // Update form to handle edit instead of create
        const form = document.getElementById('employee-form');
        form.dataset.editId = id;
        form.querySelector('button[type="submit"]').textContent = 'Update Employee';
    }
}

// Delete employee function
function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        let employees = JSON.parse(localStorage.getItem('employees'));
        employees = employees.filter(e => e.id !== id);
        localStorage.setItem('employees', JSON.stringify(employees));
        window.location.reload();
    }
}