
// Constructor
function NanoCapTable(name) {
    this.name = name;
    this.dateCreated = new Date();
    this.totalShares = 0;
    this.table = [];
}

// Add Entry

NanoCapTable.prototype.add = function(name, username, shares) {
    if (shares <= 0) {
        alert("Please Enter a valid share number");
        return false;
    }

    if ((this.table.map(entry => entry.username).includes(username)) ||
        (username === "")) {
        alert("Username Already Exists");
        return false;
    }
    let timestamp = new Date()
    this.totalShares += shares;
    let ownership = shares / this.totalShares;
    // First update all current ownership stakes
    this.table.map(entry => entry["ownership"] = entry["shares"] / this.totalShares);

    // Then push new entry
    this.table.push({"timestamp": timestamp, 
                     "name": name, 
                     "username": username, 
                     "shares":shares, 
                     "ownership": ownership});

    this.saveToLocalStorage();
    this.renderTable();

    return true;
}

// Delete Entry by username -broken because doesn't update ownership

NanoCapTable.prototype.delete = function(username) {
    try {
        // Find the index of the entry with the specified username
        const index = this.table.findIndex(entry => entry.username === username);

        // Check if the entry exists
        if (index !== -1) {
            // Remove the entry at the found index
            this.table.splice(index, 1);
            this.saveToLocalStorage();
            this.renderTable();
            return true; // Return true to indicate the entry was removed
        } else {
            alert("Username not found");
            return false; // Return false to indicate no entry was found
        }
    } catch (error) {
        alert(error);
        return false; 
    }
}

// Edit Entry, edited entries show up last

NanoCapTable.prototype.edit = function(username, newShares) {
    const index = this.table.findIndex(entry => entry.username === username);

    if (index === -1) {
        alert("Username doesn't exist.");
        return false;
    }

    this.delete(username);
    return this.add(this.table[index].name, username, newShares);
    
}

// Save to local storage - this function will save the current table locally after action

NanoCapTable.prototype.saveToLocalStorage = function() {
    localStorage.setItem('capTable', JSON.stringify(this));
}

// Load from Local Storage - locally loads table so then server can push it to github

NanoCapTable.loadFromLocalStorage = function() {
    const json = localStorage.getItem('capTable');
    if (json) {
        console.log(json)
        const obj = JSON.parse(json);
        const capTable = new NanoCapTable(obj.name);
        capTable.dateCreated = new Date(obj.dateCreated);
        capTable.totalShares = obj.totalShares;
        capTable.table = obj.table;
        capTable.table.forEach(entry => entry.ownership = entry.shares / capTable.totalShares);
        capTable.renderTable();
        return capTable;
    }
    return new NanoCapTable("Example Table");
}

// Render Table on Website
NanoCapTable.prototype.renderTable = function() {
    const tableElement = document.getElementById("table").getElementsByTagName('tbody')[0];
    tableElement.innerHTML = ""; // Clear existing content

    this.table.forEach(entry => {
        const row = document.createElement("tr");

        Object.values(entry).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableElement.appendChild(row);
    });

    // Update JSON display
    document.getElementById("json-data").textContent = JSON.stringify(this, null, 2);
}

// Initialize and load data from GitHub
fetchFromGitHub();
