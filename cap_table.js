
// Constructor
function NanoCapTable(name) {
    this.name = name;
    this.table = [];
}

// Computed property for totalShares
Object.defineProperty(NanoCapTable.prototype, 'totalShares', {
    get: function() {
        return this.table.reduce((sum, entry) => sum + entry.shares, 0);
    }
});

// Add Entry
NanoCapTable.prototype.add = function(name, username, shares) {

    if (shares <= 0) {
        alert("Please Enter a valid share number");
        return false;
    }

    if (this.table.some(entry => entry.username === username) || username === "") {
        log(DEBUG_LEVEL <= 0 & this.table)
        alert("Username Already Exists");
        return false;
    }

    let timestamp = new Date();
    
    // Could check to see if the table is empty, and if so, add created_date.

    // Push new entry
    this.table.push({"timestamp": timestamp, "name": name, "username": username, "shares": shares});

    //this.renderTable();

    return true;
}



// Render Table on Website

/** 
NanoCapTable.prototype.renderTable = function() {
    const tableElement = document.getElementById("table").getElementsByTagName('tbody')[0]; // fragile
    tableElement.innerHTML = ""; 

    const totalShares = this.totalShares; 

    this.table.forEach(entry => {
        const row = document.createElement("tr");

        // Calculate ownership for current entry
        const ownership = (entry.shares / totalShares * 100).toFixed(2) + '%';

        // Include timestamp, name, username, shares, and calculated ownership
        let data = [new Date(Date.parse(entry.timestamp)).toLocaleString(), entry.name, entry.username, entry.shares, ownership];
        log(typeof data[0]);
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

*/

fetchFromGitHub()
