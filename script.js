const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const uploadStatus = document.getElementById('upload-status');
const sharedFilesList = document.getElementById('shared-files-list');

let files = [];

uploadBtn.addEventListener('click', uploadFiles);

fileInput.addEventListener('change', (e) => {
    files = e.target.files;
});

function uploadFiles() {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        uploadStatus.textContent = `Files uploaded successfully!`;
        sharedFilesList.innerHTML = '';
        data.forEach((file) => {
            const listItem = document.createElement('li');
            const fileLink = document.createElement('a');
            fileLink.href = `/download/${file.id}`;
            fileLink.textContent = file.name;
            listItem.appendChild(fileLink);
            sharedFilesList.appendChild(listItem);
        });
    })
    .catch((error) => {
        uploadStatus.textContent = `Error uploading files: ${error.message}`;
    });
}

// Server-side code ( Node.js example )
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

app.post('/upload', upload.array('files', 12), (req, res) => {
    const files = req.files;
    const fileIds = files.map((file) => file.filename);
    res.json(fileIds.map((id, index) => ({ id, name: files[index].originalname })));
});

app.get('/download/:id', (req, res) => {
    const id = req.params.id;
    const file = files.find((file) => file.filename === id);