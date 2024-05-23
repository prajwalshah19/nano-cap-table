// Not a traditional server, these functions just provide a way to save current session to github

const GITHUB_API_URL = 'https://github.com';
const GITHUB_REPO = 'PubInv/nano-cap-table';
const GITHUB_FILE_PATH = 'cap_table.json';
const GITHUB_TOKEN = '';

// Fetch cap_table.json from GitHub
async function fetchFromGitHub() {
    try {
        const response = await fetch(`${GITHUB_API_URL}/${GITHUB_REPO}/blob/main/${GITHUB_FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        });
        const data = await response.text();
        localStorage.setItem('capTable', data);
        const capTable = NanoCapTable.loadFromLocalStorage();
        capTable.renderTable();
        return capTable;
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
    }
}

// Save cap_table.json to GitHub
async function saveToGitHub() {
    const capTable = NanoCapTable.loadFromLocalStorage();
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(capTable))));
    const message = 'Update cap table';

    try {
        const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        const sha = data.sha;

        await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                content: content,
                sha: sha,
            }, null, 2)
        });
        console.log('File updated successfully');
    } catch (error) {
        console.error('Error saving to GitHub:', error);
    }
}
