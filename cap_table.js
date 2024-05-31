// Constructor
function NanoCapTable(name) {
    this.name = name;
    this.dateCreated = new Date();
    this.table = [];
}

// Computed property for totalShares
Object.defineProperty(NanoCapTable.prototype, 'totalShares', {
    get: function() {
        return this.table.reduce((sum, entry) => sum + entry.shares, 0);
    }
});

// Delete Entry by username
NanoCapTable.prototype.delete = function(username) {
    const index = this.table.findIndex(entry => entry.username === username);
    if (index !== -1) {
        this.table.splice(index, 1);
        this.saveToLocalStorage();
        this.renderTable();
        alert('Entry deleted successfully.');
        return true;
    } else {
        alert("Username not found.");
        return false;
    }
};

// Edit Entry
NanoCapTable.prototype.edit = function(username, newName, newShares) {
    const index = this.table.findIndex(entry => entry.username === username);
    if (index === -1) {
        alert("Username doesn't exist.");
        return false;
    }

    // Update details
    this.table[index].name = newName;
    this.table[index].shares = newShares;

    this.saveToLocalStorage();
    this.renderTable();
    alert('Entry updated successfully.');
    return true;
};

// Add Entry
NanoCapTable.prototype.add = function(name, username, shares) {
    if (shares <= 0) {
        alert("Please Enter a valid share number");
        return false;
    }

    if (this.table.some(entry => entry.username === username) || username === "") {
        alert("Username Already Exists");
        return false;
    }

    let timestamp = new Date();

    // Push new entry
    this.table.push({"timestamp": timestamp, "name": name, "username": username, "shares": shares});

    this.saveToLocalStorage();
    this.renderTable();

    return true;
}



// Render Table on Website
NanoCapTable.prototype.renderTable = function() {
    const tableElement = document.getElementById("table").getElementsByTagName('tbody')[0];
    tableElement.innerHTML = ""; 

    const totalShares = this.totalShares; 

    this.table.forEach(entry => {
        const row = document.createElement("tr");

        // Calculate ownership for current entry
        const ownership = (entry.shares / totalShares * 100).toFixed(2) + '%';

        // Include timestamp, name, username, shares, and calculated ownership
        let data = [entry.timestamp.toLocaleString(), entry.name, entry.username, entry.shares, ownership];
        data.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableElement.appendChild(row);
    });

    // Update JSON display
    document.getElementById("json-data").textContent = JSON.stringify(this, null, 2);
}

// Save to local storage
NanoCapTable.prototype.saveToLocalStorage = function() {
    localStorage.setItem('capTable', JSON.stringify(this));
}

// Load from Local Storage
NanoCapTable.loadFromLocalStorage = function() {
    const json = localStorage.getItem('capTable');
    if (json) {
        const obj = JSON.parse(json);
        const capTable = new NanoCapTable(obj.name);
        capTable.dateCreated = new Date(obj.dateCreated);
        capTable.table = obj.table;
        capTable.renderTable();
        return capTable;
    }
    return new NanoCapTable("Example Table");
}

// Initialize and load data from GitHub
fetchFromGitHub();
